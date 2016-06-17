var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path = require('path');
const datetime = require('./date_time.js');

const CHAT_ROOM_PREFIX = 'chat-';
const ATTACHMENT_FOLDER_NAME = 'attachment';
var user_list = [];
var dynamicDir;
var attachmentDir;


// *Serving the web pages:
app.use(express.static(path.join(__dirname, '../../web-app/')));

app.get('/echoes', (req, res) => {
   res.sendFile(path.join(__dirname, '../../web-app/html/index.html'));
});


// *Setting up database connection:
var conn = mysql.createConnection({
   host: "localhost",
   port: 3306,
   database : "echoes_schema",
   user: "root",
   password: ""
});


// *Listening for new connections:
io.on('connection', (socket) => {




   /*
    * Registers a new user on database
    * - Emits back a true if user was registered successfully, false otherwise
    * @param data New user's name, login and password
    */
   socket.on('register-user-request', (data) => {
      // *Trying to insert new user on database:
      conn.query('insert into ?? set ?', ['user', data], (err, resultSet) => {
         // *Emiting the response:
         socket.emit('register-user-response', !err);
      });
   });




   /*
    * Validates a login atempt
    * - If success, emits back on 'login-ok-response' channel with user's id, clientId and name.
    *   It also emits to the user, all other logged in users.
    *   And send to all users that this user just logged in.
    * - If error, emits back on 'login-err-response' channel the error message
    * @param data User's login and password
    */
   socket.on('login-request', (data) => {
      // *Trying to retrieve the user from database:
      conn.query('call ??(?)', ['try_login', [data.login, data.password]], (err, resultSet) => {
         if(err){
            // *If login failed because of an error:
            socket.emit('login-err-response', 'Can\'t login: ' + err.message);
         } else if(resultSet[0].length === 0){
            // *If login failed:
            socket.emit('login-err-response', 'Wrong login or password');
         } else if(findUserIndex_byId(resultSet[0][0].id) >= 0){
            // *If login was OK, but the user is already logged in:
            socket.emit('login-err-response', 'Your account is already logged in');
         } else{

            // *If login was OK:
            var user = {
               id: resultSet[0][0].id,
               clientId: socket.id,
               name: resultSet[0][0].name
            };

            // *Sending back user's info:
            socket.emit('login-ok-response', user);
            // *Sends that this user connected to everyone, but the current user:
            socket.broadcast.emit('user-connected', user);
            // *Adding this user on list:
            user_list.push(user);
            // *Subscribes the user to its chats' rooms:
            conn.query('select ?? from ?? where ?? = ?', [['id', 'name'], 'user_chats_view', 'user', user.id], (err, resultSet2) => {
               if(err){ throw err; }
               for(var i=0; i<resultSet2.length; i++){
                  socket.join(CHAT_ROOM_PREFIX + resultSet2[i].id);
               }
               // *Sending its chats list:
               socket.emit('chat-list-update', resultSet2);
            });

            console.log('--> ' + user.name + '  @  ' + datetime.getFormattedDateTime());
         }
      });
   });




   /*
    * Searches for users by name
    * - It emits back the list of users found
    * @param data Search term string
    */
   socket.on('search-users-request', (data) => {
      conn.query('select ?? from ?? where match(??) against(? in boolean mode)', [['id', 'login', 'name'], 'user', 'name', getSearchableText(data)], (err, resultSet) => {
         socket.emit('search-users-response', resultSet);
         if(err){ throw err; }
      });
   });




   /*
    * Adds a given user to current user's contact list
    * - It emits back if the contact could be added or not
    * @param data Contact's user id
    */
   socket.on('add-contact-request', (data) => {
      // *Searching for the user, based on its clientId:
      var user = findUser_byClientId(socket.id);

      var friendshipData = {
         me_user_fk: user.id,
         contact_user_fk: data
      };

      conn.query('insert into ?? set ?', ['contact', friendshipData], (err, resultSet) => {
         socket.emit('add-contact-response', !err);
         if(err){ throw err; }
      });
   });




   /*
    * Retrieves the current user's contact list
    * - It emits back the contact list
    */
   socket.on('user-contact-list-request', () => {
      // *Searching for the user, based on its clientId:
      var user = findUser_byClientId(socket.id);

      // *Querying for user's contacts:
      conn.query('select ?? from ?? where ?? = ?', [['id', 'login', 'name'], 'user_contacts_view', 'user', user.id], (err, resultSet) => {
         if(err){ throw err; }
         socket.emit('user-contact-list-response', resultSet);
      });
   });




   /*
    * Creates a new chat, and adds the current user to it
    * - It emits back if the chat could be created TODO
    * @param data {chatName: Chat's name, users: Users' ids}
    */
   socket.on('create-chat-request', (data) => {

      // *Searching for the user, based on its clientId:
      var user = findUser_byClientId(socket.id);

      conn.query('call ??(?, ?)', ['chat_create', user.id, data.chatName], (err, resultSet) => {
         if(err){
            socket.emit('create-chat-response', null);
            throw err;
         }

         var users = data.users;
         var chat = resultSet[0][0];

         if(users && users.length > 0){
            var promiseArray = [];
            // *Declaring the function that generates a promise to call the procedure on database:
            var generateCallPromisse = (userId) => {
               return new Promise((resolve, reject) => {
                  conn.query('call ??(?, ?)', ['chat_add_user', chat.id, userId], (err, resultSet) => {
                     if(err){ reject(err); }
                     resolve();
                  });
               });
            };

            // *Putting all promisses together:
            for(var i=0; i<users.length; i++){
               promiseArray.push(generateCallPromisse(users[i]));
            }

            // *Executing the promisses:
            Promise
               .all(promiseArray)
               .then(() => {
                  // *If creation was successful:
                  // *Add me to the users list:
                  users.push(user.id);
                  // *For each user:
                  for(var i=0; i<users.length; i++){
                     var userAdded = findUser_byId(users[i]);
                     if(userAdded){
                        // *If the user added is logged in:
                        var userSocket = io.sockets.connected[userAdded.clientId];
                        // *Adding them to this new chat's room:
                        userSocket.join(CHAT_ROOM_PREFIX + chat.id);
                     }
                  }
                  // *Sending the new chat:
                  io.sockets.in(CHAT_ROOM_PREFIX + chat.id).emit('create-chat-response', chat);
               }, (err) => {
                  // *If creation failed:
                  socket.emit('create-chat-response', null);
                  throw err;
               });

         } else{
            socket.join(CHAT_ROOM_PREFIX + chat.id);
            socket.emit('create-chat-response', chat);
         }
      });
   });




   /*
    * Retrieves all info about requested chat
    * - It emits back the chat's info
    * @param data Chat id
    */
   socket.on('chat-info-request', (data) => {
      // *Querying for chat's info:
      conn.query('select ?? from ?? where ?? = ?', [['id', 'name'], 'chat', 'id', data], (err, resultSet) => {
         if(err){ throw err; }
         socket.emit('chat-info-response', resultSet[0]);
      });
   });




   /*
    * Loads the message feed for a given chat id
    * - It emits back the chat's messages
    * @param data Chat id
    */
   socket.on('feed-load-request', (data) => {
      // *Querying for chat's messages:
      conn.query('call ??(?)', ['chat_get_feed', data], (err, resultSet) => {
         if(err){ throw err; }
         socket.emit('feed-load-response', resultSet[0]);
      });
   });




   /*
    * Sends a message to requested chat
    * - It emits the message for all users on chat's room
    *
    * @param data {message: The message text, chatId: The chat id, attachment: {base64: The base64 url, extension: The original file's extension}}
    */
   socket.on('feed-send-message-request', (data) => {
      // *Searching for the user, based on its clientId:
      var originUser = findUser_byClientId(socket.id);

      var attachment_file_path = null;
      var attachment_mime_type = null;

      // *It records the message and its attachments if any on database, and then sends it back to all users on chat:
      var sendMessage = () => {
         // *It will persist the message on database if the current user could send messages to this chat:
         conn.query('call ??(?)', ['chat_send_message', [data.chatId, originUser.id, data.message, attachment_file_path, attachment_mime_type]], (err, resultSet) => {
            if(err) throw err;
            // TODO if error, tell the origin user
            io.sockets.in(CHAT_ROOM_PREFIX + data.chatId).emit('message-received', resultSet[0][0]);
         });
      };


      if(data.attachment !== null && data.attachment.base64 !== null && data.attachment.extension !== null){
         // *If the message contains an attachment:
         var uuid = require('uuid');
         var fs = require('fs');

         // *Getting attachment's mime type:
         attachment_mime_type = /^data:(.*);/.exec(data.attachment.base64)[1];
         // *Getting it's actual content:
         var base64Content = /^data:.*;base64,(.*)/i.exec(data.attachment.base64)[1];

         // *Setting up its location and name based on an uuid code:
         attachment_file_path = '/' + ATTACHMENT_FOLDER_NAME + '/' + uuid.v1() + '.' + data.attachment.extension;
         var filePath = dynamicDir + attachment_file_path;

         // *Storing the file on disk:
         fs.writeFile(filePath, base64Content, 'base64', function(err){
            if(err) throw err;
            // *Sending the message:
            sendMessage();
         });
      } else{
         // *If it's just a simple text message:
         sendMessage();
      }
   });




   socket.on('disconnect', () => {
      // *Finding this user index on the list:
      var userIndex = findUserIndex_byClientId(socket.id);
      if(userIndex >= 0){
         // TODO remove user from his chat's rooms
         // *Removing the disconnected user from the list, and returning it:
         var user = user_list.splice(userIndex, 1)[0];
         // *Broadcasts to everyone, but the user, that he disconnected:
         socket.broadcast.emit('user-disconnected', user.id);
         // *Logging the message:
         console.log('<-- ' + user.name + '  @  ' + datetime.getFormattedDateTime());
      }
   });
});



function findUser_byId(id){
   return user_list.find(user => id == user.id);
}
function findUser_byClientId(clientId){
   return user_list.find(user => clientId == user.clientId);
}
function findUser_byLogin(login){
   return user_list.find(user => login == user.login);
}

function findUserIndex_byId(id){
   return user_list.findIndex(user => id == user.id);
}
function findUserIndex_byClientId(clientId){
   return user_list.findIndex(user => clientId == user.clientId);
}
function findUserIndex_byLogin(login){
   return user_list.findIndex(user => login == user.login);
}



function getSearchableText(text){
   try{
      text = text.match(/(?:[^\s"]+|"[^"]*")+/g);
      text = '+' + text.join('* +') + '*';
   } catch(e){
      text = '';
   }
   return text;
}



function stopServer(err){
   console.log('>> Killing server...');
   if(err){
      console.error(err);
      process.exit(1);
      throw err;
   } else{
      process.exit(0);
   }
}


conn.connect((err) => {
   if(err){
      conn = null;
      stopServer(err);
   }

   onDatabaseConnected();

   // *Loading up server on port 3000:
   http.listen(3000, () => {
      console.log('\n>> Server listening on port 3000');
      onServerStarted();
   });
});



function onServerStarted(){

}



function onDatabaseConnected(){
   var fs = require('fs');

   // *Checking for directories:
   console.log('>> Checking for directories...');

   // *Checking for dynamic directory:
   dynamicDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
   dynamicDir += '/echoes/dynamic';
   if(!fs.existsSync(dynamicDir)){
      console.log('\t>> Creating \'dynamic directory\'...');
      fs.mkdirSync(dynamicDir);
      console.log('\t>> \'Dynamic directory\' created');
   }

   // *Checking for attachment directory:
   attachmentDir = dynamicDir + '/' + ATTACHMENT_FOLDER_NAME;
   if (!fs.existsSync(attachmentDir)){
      console.log('\t>> Creating \'attachment directory\'...');
      fs.mkdirSync(attachmentDir);
      console.log('\t>> \'Attachment directory\' created');
   }

   // *Serving dynamic directory:
   app.use(express.static(dynamicDir + '/'));

   console.log('>> Directories checked');
}
