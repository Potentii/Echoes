$(document).ready(function(){

   $('#add-chat-button').click(addChatButton_onClick);
   $('#add-contact-button').click(addContactButton_onClick);

   var listHandler =
      new SelectableListHandler(
         $('#lobby-chats-list'),
         getChatListItem,
         (chat1, chat2) => chat1.id == chat2.id,
         SINGLE_SELECTION
      );

   socket.on('chat-list-update', (chats) => {
      listHandler.update(chats);
   });

   socket.on('chat-received-message', (data) => {
      listHandler.findIndex(listHandler.getArray(), data.chat);
   });


   listHandler.select(function(selection, item){
      var chatId = item.id;
      loadFeed(chatId);
   });
});



function addChatButton_onClick(){
   chatManagingDialog.show({
      id: null,
      name: '',
      users: []
   });
}
function addContactButton_onClick(){
   addContactDialog.show();
}


function userListing_onUpdate(){
   enableEmptyListText_userListing(user_list.length===0);
}
