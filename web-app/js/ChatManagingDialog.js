function ChatManagingDialog(){

}

ChatManagingDialog.prototype.load = function(chat){
   enableContactPicker(true);



   if(chat.id){
      $('#chat-managing-dialog .app-bar > span').text('Chat managing');
      $('#chat-managing-ok-button').off('click');
      $('#chat-managing-ok-button').on('click', function(e){
         // TODO save chat data, if it's different
         enableContactPicker(false);
      });
   } else{
      $('#chat-managing-dialog .app-bar > span').text('Start new chat');
      $('#chat-managing-ok-button').off('click');
      $('#chat-managing-ok-button').on('click', function(e){
         // TODO register new chat
         enableContactPicker(false);
      });
   }


   $('#chat-managing-cancel-button').off('click');
   $('#chat-managing-cancel-button').on('click', function(e){
      enableContactPicker(false);
   });
};

const chatManagingDialog = new ChatManagingDialog();
