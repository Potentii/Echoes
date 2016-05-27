var user_info = {};
var user_list = [];
/*
$(document).ready(function(){
   user_info = {
      userName: storageGet_userName(),
      id: ''
   };


   socket.on('user-list-update', (data) => {
      // *Removing myself from list:
      user_list = data.filter(val => user_info.id!==val.id);
      updateUserListing(user_list);
      onListingUpdated_user();
   });

   socket.on('user-connected', (user) => {
      if(user.id != user_info.id){
         // *If it's not me:
         user_list.push(user);
         addUserOnListing(user);
         onListingUpdated_user();
      }
   });

   socket.on('user-disconnected', (id) => {
      user_list = user_list.filter(val => id!=val.id);
      removeUserFromListing(id);
      onListingUpdated_user();
   });


   socket.on('send-id', (id) => {
      user_info.id = id;
      socket.emit('ready', user_info);
   });

   socket.emit('need-id');

});
*/
