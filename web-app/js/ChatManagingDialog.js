// *Inheritance
ChatManagingDialog.prototype = Object.create(DialogHandler.prototype);

function ChatManagingDialog(){
   DialogHandler.call(this, $('#chat-managing-dialog'));
   this.listHandler = null;
   this.usersAddedList = null;
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

   this.usersAddedList =
      new ListHandler(
         $('#chat-managing-user-selection-list'),
         getUserListItem,
         (user1, user2) => user1.id == user2.id
      );


   // *If user selects no elements, it will disable the OK button:
   this.listHandler.setOnSelectionUpdatedListener((selectedArray, itemSelected) => {
      //$('#chat-managing-ok-button').prop('disabled', this.listHandler.getSelectedItemArray().length === 0);

      this.usersAddedList.update(selectedArray);
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
      this.usersAddedList.update(result);
   });


   if(chat.id && chat.id != -1){
      $('#chat-managing-dialog-title > span').text('Chat managing');
      $('#chat-managing-form').on('submit', function(e){
         alert('df');
         // TODO save chat data, if it's different
      });
   } else{
		$('#chat-managing-dialog-title > span').text('Start new chat');
      $('#chat-managing-form').submit((e) => {
			e.preventDefault();
         var selectedUsersId = this.listHandler.getSelectedItemArray().map(user => user.id);
			socket.emit('create-chat-request', {chatName: $('#chat-managing-name-input').val(), users: selectedUsersId});
         this.hide();
      });
   }


   $('#chat-managing-cancel-button').on('click', (e) => {
      this.hide();
   });


   socket.emit('user-contact-list-request');
};



ChatManagingDialog.prototype.unload = function(){
   DialogHandler.prototype.unload.call(this);
   socket.removeAllListeners('user-contact-list-response');
   socket.removeAllListeners('chat-contact-list-response');
   $('#chat-managing-name-input').off('chage paste keyup');
   $('#chat-managing-form').off('submit');
   $('#chat-managing-cancel-button').off('click');
   $('#chat-managing-name-input').prop('disabled', true);
   $('#chat-managing-dialog-title > span').text('');
   this.listHandler.clearList();
   this.listHandler = null;
   this.usersAddedList.clearList();
   this.usersAddedList = null;
};
