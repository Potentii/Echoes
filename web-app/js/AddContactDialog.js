// *Inheritance
AddContactDialog.prototype = Object.create(DialogHandler.prototype);

function AddContactDialog(){
   DialogHandler.call(this, $('#add-contact-dialog'));
   this.listHandler = null;
}



AddContactDialog.prototype.load = function(data){
   DialogHandler.prototype.load.call(this);

   // *Re-enabling all this dialog's inputs:
   $('#add-contact-search-input').prop('disabled', false);

   // *Setting up a new list handler:
   this.listHandler =
      new SelectableListHandler(
         $('#add-contact-user-list'),
         getUserListItem,
         (user1, user2) => user1.id == user2.id,
         SINGLE_SELECTION
      );

   // *If user selects no elements, it will disable the OK button:
   this.listHandler.setOnSelectionUpdatedListener(() => {
      $('#add-contact-ok-button').prop('disabled', this.listHandler.getSelectedItemArray().length === 0);
   });

   // *When server responds to user's search:
   socket.on('search-users-response', (result) => {
      // *Updating the list:
      this.listHandler.update(result);
   });

   // *When user type something on search box:
   $('#add-contact-search-input').on('chage paste keyup', function(e){
      // *Request server to search for this user:
      socket.emit('search-users-request', e.target.value);
   });

   // *When user clicks on OK button:
   $('#add-contact-ok-button').on('click', (e) => {
      // *Request the server to add the given id as friend:
      socket.emit('add-contact-request', this.listHandler.getSelectedItemArray()[0].id);
      this.hide();
   });

   // *When user clicks on CANCEL button:
   $('#add-contact-cancel-button').on('click', (e) => {
      this.hide();
   });
};



AddContactDialog.prototype.unload = function(){
   DialogHandler.prototype.unload.call(this);

   // *Unloading:
   socket.removeAllListeners('search-users-response');
   $('#add-contact-ok-button').prop('disabled', true);
   $('#add-contact-ok-button').off('click');
   $('#add-contact-cancel-button').off('click');
   $('#add-contact-search-input').prop('disabled', true).val('');
   $('#add-contact-search-input').off('chage paste keyup');
   this.listHandler.clearList();
   this.listHandler = null;
};
