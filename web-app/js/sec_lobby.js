//var user_list = [];
//var user_info = {};

$(document).ready(function(){

   $('#add-chat-button').click(addChatButton_onClick);
   $('#add-contact-button').click(addContactButton_onClick);
   // TODO load my chats from server
   /*
   socket.on('user-list-update', (data) => {
      user_list = data;
      updateUserListing(user_list);
      userListing_onUpdate();
   });

   socket.on('user-connected', (user) => {
      user_list.push(user);
      addUserOnListing(user);
      userListing_onUpdate();
   });

   socket.on('user-disconnected', (id) => {
      user_list = user_list.filter(val => id!=val.id);
      removeUserFromListing(id);
      userListing_onUpdate();
   });
   */
});

function addChatButton_onClick(){
   chatManagingDialog.load({
      id: null,
      name: '',
      users: []
   });
}
function addContactButton_onClick(){
   addContactDialog.load();
}


function userListing_onUpdate(){
   enableEmptyListText_userListing(user_list.length===0);
}
