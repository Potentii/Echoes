var getUserListItem = (user) => {
   var item = $('<li>')
      .attr('data-id', user.id)
      .addClass('horizontal-layout');

   $('<span>')
      .addClass('primary')
      .text(user.name)
      .appendTo(item);

   return item;
};


function updateUserListing(newUserList){
   var dom_userList = $('#lobby-users-list');
   $('#lobby-users-list > li').remove();
   for(var i=0; i<newUserList.length; i++){
      dom_userList.append(getUserListItem(newUserList[i]));
   }
}

function addUserOnListing(user){
   $('#lobby-users-list').append(getUserListItem(user));
}
function removeUserFromListing(id){
   $('#lobby-users-list > li[data-id="' + id + '"]').remove();
}


var emptyListTextEnabled_userListing = true;
function enableEmptyListText_userListing(enable){
   if(enable != emptyListTextEnabled_userListing){
      if(enable){
         $('#lobby-users-list > .empty-list-text').show();
      } else{
         $('#lobby-users-list > .empty-list-text').hide();
      }
      emptyListTextEnabled_userListing = enable;
   }
}
