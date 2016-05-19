var targetIp = null;
var noMessagesSpanDisabled = false;



$(document).ready(function(){
   // *Loading basic info:
   loadTargetIp();
   loadMyIp();
   loadPreviousMessages(targetIp);

   // *Adding listener to 'message-received' ipcRenderer's channel:
   ipcRenderer.removeAllListeners('message-received');
   ipcRenderer.on('message-received', (e, arg) => {
      console.log(arg);
      addMessage(arg);
      onMessage(arg);
      scrollToBottom();
   });
});



/**
 * sendButton onclick listener
 */
function sendButton_onClick(){
   var messageIn = $('#message-input');
   var messageText = messageIn.val().trim();
   if(messageText.length>0 && myIp && targetIp){
      var messageData = {
         message: messageText,
         ip: myIp,
         target: targetIp,
         time: getHour()
      };

      // *Sending the message via Ajax:
      $.ajax({
         method: 'POST',
         url: "http://" + targetIp + ":" + SERVER_PORT  + "/" +
            'message/send',
         dataType: "json",
         data: messageData
      })
      .done(function(response){
         // *On response, add the message on feed:
         messageIn
            .val('')
            .focus();
         onMessage(messageData);
         scrollToBottom();
         addMessage(messageData);
      })
      .fail(function(jqXHR, textStatus, errorThrown){
         alert("Couldn't send: \"" + messageData.message + "\"\n\nReason: \n"  + errorThrown);
      });
   }
}



/**
 * backBtn onclick listener
 */
function backBtn_onClick(){
   window.location.href = '../html/index.html';
}



/**
 * Retrieves the last target ip from localStorage
 */
function loadTargetIp(){
   targetIp = localStorage.getItem(TARGET_IP_KEY);
}



/**
 * Loads and shows on chat feed all previous messages with the given ip target
 */
function loadPreviousMessages(ip){
   var messages = getMessages();
   var messagesFromIp = messages.filter(val => ip==val.ip || ip==val.target);

   for(var i=0; i<messagesFromIp.length; i++){
      onMessage(messagesFromIp[i]);
   }
   scrollToBottom();
}



/**
 * Adds the given 'messageData' on chat feed
 */
function onMessage(messageData){
   disableNoMessagesText();
   $('#feed-list').append(getMessageRow(messageData));
}



/**
 * Scrolls to the bottom of page
 */
function scrollToBottom(){
   $('body').animate({ scrollTop: $(document).height() }, 800);
}



/**
 * Hides 'no-messages-span' text from the feed
 */
function disableNoMessagesText(){
   if(!noMessagesSpanDisabled){
      $('#no-messages-span').fadeOut(200);
      noMessagesSpanDisabled = true;
   }
}



/**
 * Returns a DOM element representing a message on feed
 */
function getMessageRow(messageData){
   var me = messageData.ip==myIp;
   var row = $('<li>')
      .attr('data-owner', me?'me':'');

   $('<span>')
      .addClass('message-info-span')
      .text((me?'Me':messageData.ip) + ' @ ' + messageData.time)
      .appendTo(row);
   $('<span>')
      .addClass('message-content-span')
      .text(messageData.message)
      .appendTo(row);

   return row;
}
