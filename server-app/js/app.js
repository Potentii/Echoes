var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


var user_list = [];

// *Serving the web pages:
app.use(express.static(path.join(__dirname, '../../web-app/')));

app.get('/echoes', (req, res) => {
   res.sendFile(path.join(__dirname, '../../web-app/html/register.html'));
});

app.get('/echoes/app', (req, res) => {
   res.sendFile(path.join(__dirname, '../../web-app/html/index.html'));
});


// *Listening for new connections:
io.on('connection', (socket) => {
   var id = socket.id;

   console.log(id + ' has connected');

   socket.on('need-id', () => {
      // *Sending back its id:
      socket.emit('send-id', id);
   });


   socket.on('ready', (user) => {
      // *Adding this user on list:
      user_list.push(user);
      // *Updates the user's contact list:
      socket.emit('user-list-update', user_list);
      // *Sends that this user connected to everyone, but the current user:
      socket.broadcast.emit('user-connected', user);
   });


   socket.on('disconnect', () => {
      // *Removing this user from the list:
      user_list = user_list.filter(val => id!=val.id);
      // *Broadcasts to everyone, but the user, that he disconnected:
      socket.broadcast.emit('user-disconnected', id);
      console.log(id + ' has disconnected');
   });
});


// *Loading up server on port 3000:
http.listen(3000, () => {
   console.log('Listening on port 3000');
});
