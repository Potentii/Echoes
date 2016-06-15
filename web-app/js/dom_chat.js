

const getUserListItem = (user) => {
   var item = $('<li>')
      .attr('data-id', user.id)
      .addClass('horizontal-layout');

   $('<span>')
      .addClass('primary')
      .text(user.name)
      .appendTo(item);

   return item;
};


const getChatListItem = (chat) => {
   return getUserListItem(chat);
};

const getFeedListItem = (message) => {
   var itsMine = currentUserId == message.origin_user_fk;
   var item = $('<li>')
      .attr('data-mine', itsMine)
      .addClass('flex-vertical-layout');

   $('<span>')
      .addClass('secondary message-info')
      .text((itsMine?'me':message.origin_user_name) + ' - ' + getFormattedTime(message.date))
      .appendTo(item);


   if(message.attachment_file_path){
      // *If there's any attachment:
      var attachmentNode = $('<span>')
         .addClass('message-attachment');

      if(/image\//i.test(message.attachment_mime_type)){
         // *If it's an image:
         attachmentNode.attr('data-type', 'image');
         attachmentNode.css('background-image', 'url(' + message.attachment_file_path + ')');
         attachmentNode.addClass('raised card');
      }
      attachmentNode.appendTo(item);
   }


   $('<span>')
      .addClass('primary')
      .text(message.text)
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


function scrollFeedToBottom(duration){
   duration = duration || 0;
   $('#feed-list').animate({ scrollTop: $('#feed-list')[0].scrollHeight }, duration);
}
