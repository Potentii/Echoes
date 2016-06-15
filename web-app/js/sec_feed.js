var currentChatId = null;


$(document).ready(function(){
   var currentAttachment = null;

   // *Setting up the feed list controller:
   var feedListHandler =
      new ListHandler(
         $('#feed-list'),
         getFeedListItem,
         (message1, message2) => message1.id == message2.id
      );

   // *When a message arrives:
   socket.on('message-received', (data) => {
      if(currentChatId == data.chat){
         // *If the message is from the current chat:
         slideChatPanel(PANEL_RIGHT);
         feedListHandler.join(data);
         scrollFeedToBottom(800);
      }
   });

   // *When info from the chat arrives:
   socket.on('chat-info-response', (chat) => {
      // *Updates the chat's name label:
      $('#feed-chat-name-text').text(chat.name);
   });

   // *When the entire feed gets loaded:
   socket.on('feed-load-response', (feed) => {
      feedListHandler.clearList();
      slideChatPanel(PANEL_RIGHT);
      feedListHandler.update(feed);
      scrollFeedToBottom();
   });

   // *Message form submit event:
   $('#feed-message-input-container').submit(function(e){
      e.preventDefault();
      // *If user isn't on a chat:
      if(!currentChatId) return;

      // *Building message data object:
      var messageData = {
         message: $('#feed-message-input').val(),
         chatId: currentChatId,
         attachment: currentAttachment
      };

      // *Sending the message:
      socket.emit('feed-send-message-request', messageData);

      // *Erasing the attachment:
      currentAttachment = null;
      // *Reseting message input:
      $('#feed-message-input').prop('required', true);
      $('#feed-message-input').val('');
   });



   // *Message container drop event:
   addDropZone($('#feed-message-input-container'));
   $('#feed-message-input-container').on('drop', function(e){
      e.preventDefault();

      // *Getting the types of all dragged items:
      var types = e.originalEvent.dataTransfer.types;

      if(types.indexOf('Files')>-1){
         // *If it's files from system:
         var files = e.originalEvent.dataTransfer.files;
         currentAttachment = null;

         // *Loads the file as base64, and sets it to 'currentAttachment':
         loadFileAsBase64(files[0], (base64URL) => {
            currentAttachment = {
               base64: base64URL,
               extension: getFileExtension(files[0].name).toLowerCase()
            };

            // *The user just attached a file to the message, so it's no longer required to send a text with it:
            $('#feed-message-input').prop('required', false);
         });
      }
   });
});



/*
 * Loads a given file as an base64 url
 * @param file The file to be loaded
 * @param callback A function that receives the base64 url when it's loaded
 */
function loadFileAsBase64(file, callback){
   var reader = new FileReader();
   reader.addEventListener('load', function(){
      callback(this.result);
   }, false);
   reader.readAsDataURL(file);
}



/*
 * Tests if the given file is an image
 * @param file The file to be tested
 */
function isImage(file){
   return /image/i.test(file.type);
}



/*
 * Retrieves the extension for a given file
 * @param fileName The file's path with its name
 */
function getFileExtension(fileName){
   return fileName.split('.').pop().split(/\#|\?/)[0];
}



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
