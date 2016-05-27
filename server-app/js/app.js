var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path = require('path');



var user_list = [];

// *Serving the web pages:
app.use(express.static(path.join(__dirname, '../../web-app/')));

app.get('/echoes', (req, res) => {
   res.sendFile(path.join(__dirname, '../../web-app/html/index.html'));
});


var conn = mysql.createConnection({
   host: "localhost",
   port: 3306,
   database : "echoes_schema",
   user: "root",
   password: "root"
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
      conn.query('select ?? from ?? where ?? = ? and ?? = ?', [['id', 'name'], 'user', 'login', data.login, 'password', data.password], (err, resultSet) => {
         if(err){
            // *If login failed because of an error:
            socket.emit('login-err-response', 'Can\'t login: ' + err.message);
         } else if(resultSet.length === 0){
            // *If login failed:
            socket.emit('login-err-response', 'Wrong login or password');
         } else if(findUserListIndex(resultSet[0].id) >= 0){
            // *If login was OK, but the user is already logged in:
            socket.emit('login-err-response', 'Your account is already logged in');
         } else{
            // *If login was OK:
            var user = {
               id: resultSet[0].id,
               clientId: socket.id,
               name: resultSet[0].name
            };

            // *Sending back user's info:
            socket.emit('login-ok-response', user);
            // *Updates user's contact list:
            socket.emit('user-list-update', user_list);
            // *Sends that this user connected to everyone, but the current user:
            socket.broadcast.emit('user-connected', user);
            // *Adding this user on list:
            user_list.push(user);

            console.log(user.name + ' has connected');
         }
      });
   });

   socket.on('search-users-request', (data) => {
      conn.query('select ?? from ?? where match(??) against(? in boolean mode)', [['id', 'login', 'name'], 'user', 'name', data.word], (err, resultSet) => {
         socket.emit('search-users-response', resultSet);
      });
   });

   socket.on('add-contact', (data) => {
      conn.query('insert into ?? set ?', ['friendship', data], (err, resultSet) => {

      });
   });



   socket.on('disconnect', () => {
      var clientId = socket.id;
      // *Removing this user from the list:
      var userIndex = user_list.findIndex(user => clientId == user.clientId);
      if(userIndex >= 0){
         // *Removing the disconnected user from the list, and returning it:
         var user = user_list.splice(userIndex, 1)[0];
         // *Broadcasts to everyone, but the user, that he disconnected:
         socket.broadcast.emit('user-disconnected', user.id);
         // *Logging the message:
         console.log(user.name + ' has disconnected');
      }
   });
});



function findUserListIndex(userId){
   return user_list.findIndex(user => userId == user.id);
}




conn.connect((err) => {
   if(err){
      conn = null;
      console.error(err);
      process.exit(1);
      throw err;
   }


   // *Loading up server on port 3000:
   http.listen(3000, () => {
      console.log('Listening on port 3000');
   });
});
