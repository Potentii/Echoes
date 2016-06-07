var currentChatId = null;

$(document).ready(function(){
   var feedListHandler =
      new ListHandler(
         $('#feed-list'),
         getFeedListItem,
         (message1, message2) => message1.id == message2.id
      );

      socket.on('message-received', (data) => {
         if(currentChatId == data.chat){
            slideChatPanel(PANEL_RIGHT);
            feedListHandler.join(data);
            scrollFeedToBottom(800);
         }
      });

      socket.on('chat-info-response', (chat) => {
         $('#feed-chat-name-text').text(chat.name);
      });

      socket.on('feed-load-response', (feed) => {
         feedListHandler.clearList();
         slideChatPanel(PANEL_RIGHT);
         feedListHandler.update(feed);
         scrollFeedToBottom();
      });

      $('#feed-message-input-container').submit(function(e){
         e.preventDefault();
         if(!currentChatId) return;
         var messageData = {
            message: $('#feed-message-input').val(),
            chatId: currentChatId
         };
         $('#feed-message-input').val('');
         socket.emit('feed-send-message-request', messageData);
      });
});

function loadFeed(chatId){
   unblockChating();
   socket.emit('feed-load-request', chatId);
   socket.emit('chat-info-request', chatId);
   currentChatId = chatId;
}

function blockChating(){
   $('#feed-message-input').prop('disabled', true);
}
function unblockChating(){
   $('#feed-message-input').prop('disabled', false);
}
