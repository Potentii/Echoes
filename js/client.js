var targetIp = null;
var noMessagesSpanDisabled = false;


$(document).ready(function(){
   loadTargetIp();
   loadMyIp();
   loadPreviousMessages(targetIp);

   ipcRenderer.removeAllListeners('message-received');
   ipcRenderer.on('message-received', (e, arg) => {
      console.log(arg);
      addMessage(arg);
      onMessage(arg);
      scrollToBottom();
   });
});





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

      $.ajax({
         method: 'POST',
         url: "http://" + targetIp + ":" + SERVER_PORT  + "/" +
            'message/send',
         dataType: "json",
         data: messageData
      })
      .done(function(response){
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



function loadTargetIp(){
   targetIp = localStorage.getItem(TARGET_IP_KEY);
}



function loadPreviousMessages(ip){
   var messages = getMessages();
   var messagesFromIp = messages.filter(val => ip==val.ip || ip==val.target);

   for(var i=0; i<messagesFromIp.length; i++){
      onMessage(messagesFromIp[i]);
   }
   scrollToBottom();
}




function onMessage(messageData){
   disableNoMessagesText();
   $('#feed-list').append(getMessageRow(messageData));
}

function scrollToBottom(){
   $('body').animate({ scrollTop: $(document).height() }, 800);
}

function disableNoMessagesText(){
   if(!noMessagesSpanDisabled){
      $('#no-messages-span').fadeOut(200);
      noMessagesSpanDisabled = true;
   }
}



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

function backBtn_onClick(){
   window.location.href = '../html/index.html';
}
