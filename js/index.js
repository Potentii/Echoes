var noChatsSpanDisabled = false;


$(document).ready(function(){
   loadMyIp();
   loadPreviousChats();

   $('#ip-input')
      .val(localStorage.getItem(TARGET_IP_KEY))
      .focus();

   ipcRenderer.removeAllListeners('message-received');
   ipcRenderer.on('message-received', (e, arg) => {
      addMessage(arg);
      var messages = getMessages();
      var messagesFromIp = messages.filter(val => arg.ip==val.ip);

      if(messagesFromIp.length == 1 || $('#chat-list > li[data-ip="' + arg.ip + '"]').length === 0){
         // *If it's a new ip:
         onChat(arg);
      } else{
         // *If it's not:
         updateLastMessage(messagesFromIp[messagesFromIp.length-1]);
      }
   });

});





function confirmBtn_onClick(){
   var ip = $('#ip-input').val().trim();

   if(ip.length > 0){
      localStorage.setItem(TARGET_IP_KEY, ip);

      window.location.href = '../html/client.html';
   }
}


function loadPreviousChats(){
   var messages = getMessages();
   var chats = messages.reduce((accumulator, val) => {
      var ipIndex = accumulator.findIndex(chatData => val.ip==chatData.target || val.ip==chatData.ip);

      if(ipIndex < 0){
         accumulator.push(val);
      } else{
         accumulator[ipIndex] = val;
      }

      return accumulator;
   }, []);

   for(var i=0; i<chats.length; i++){
      onChat(chats[i]);
   }
}


function onChat(chatData){
   disableNoChatsText();
   var row = getChatRow(chatData);
   $('#chat-list').append(row);
   updateLastMessage(chatData);

   row.off('click');
   row.on('click', function(e){
      var ip = $(this).attr('data-ip');

      localStorage.setItem(TARGET_IP_KEY, ip);
      window.location.href = '../html/client.html';
   });
}

function disableNoChatsText(){
   if(!noChatsSpanDisabled){
      $('#no-chats-span').fadeOut(200);
      noChatsSpanDisabled = true;
   }
}

function getChatRow(chatData){
   var me = chatData.ip==myIp;
   var row = $('<li>')
      .attr('data-ip', me?chatData.target:chatData.ip);

   $('<span>')
      .addClass('chat-info-span')
      .text(me?chatData.target:chatData.ip)
      .appendTo(row);
   $('<span>')
      .addClass('chat-content-span')
      .attr('data-owner', me?'me':'')
      .appendTo(row);

   return row;
}

function updateLastMessage(chatData){
   var me = chatData.ip==myIp;
   $('#chat-list > li[data-ip="' + (me?chatData.target:chatData.ip) + '"]')
      .each(function(){
         $(this)
            .children('.chat-content-span')
            .text(chatData.message)
            .attr('data-owner', me?'me':'');
      });
}
