// *Inheritance
ChatManagingDialog.prototype = Object.create(DialogHandler.prototype);

function ChatManagingDialog(){
   DialogHandler.call(this, $('#chat-managing-dialog'));
   this.listHandler = null;
}

ChatManagingDialog.prototype.load = function(chat){
   DialogHandler.prototype.load.call(this);

   // *Re-enabling all this dialog's inputs:
   $('#chat-managing-name-input').prop('disabled', false);


   // *Setting up a new list handler:
   this.listHandler =
      new SelectableListHandler(
         $('#chat-managing-user-list'),
         getUserListItem,
         (user1, user2) => user1.id == user2.id,
         MULTIPLE_SELECTION
      );


   // *If user selects no elements, it will disable the OK button:
   this.listHandler.setOnSelectionUpdatedListener(() => {
      $('#chat-managing-ok-button').prop('disabled', this.listHandler.getSelectedItemArray().length === 0);
   });

   $('#chat-managing-name-input').on('chage paste keyup', function(e){
      //$('#chat-managing-ok-button').prop('disabled', $(this).val().trim().length === 0);
   });



   // *When server returns the user's contact list:
   socket.on('user-contact-list-response', (result) => {
      // *Updating the list:
      this.listHandler.join(result);
   });

   // *When server returns the chat's contact list:
   socket.on('chat-contact-list-response', (result) => {
      // *Updating the list:
      this.listHandler.join(result);
   });


   if(chat.id && chat.id != -1){
      $('#chat-managing-dialog .app-bar > span').text('Chat managing');
      $('#chat-managing-form').on('submit', function(e){
         // TODO save chat data, if it's different
      });
   } else{
		$('#chat-managing-dialog .app-bar > span').text('Start new chat');
      $('#chat-managing-form').submit(function(e){
         // TODO register new chat
			e.preventDefault();
         alert('dd');
         console.log('fff');
			//socket.emit('create-chat-request', $('#chat-managing-name-input').val());
      });
   }

   socket.emit('user-contact-list-request');
};



ChatManagingDialog.prototype.unload = function(){
   DialogHandler.prototype.unload.call(this);
   socket.removeAllListeners('user-contact-list-response');
   socket.removeAllListeners('chat-contact-list-response');
   $('#chat-managing-name-input').off('chage paste keyup');
   $('#chat-managing-form').off('submit');
   $('#chat-managing-name-input').prop('disabled', true);
   $('#chat-managing-dialog .app-bar > span').text('');
   this.listHandler.clearList();
   this.listHandler = null;
};
