function AddContactDialog(){

}

AddContactDialog.prototype.load = function(){
   enableAddContact(true);
   /*
   $('#add-contact-search-input').on('change', function(e){
      // TODO do the search
   });*/
};

const addContactDialog = new AddContactDialog();
