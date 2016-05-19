var noChatsSpanDisabled = false;



$(document).ready(function(){
   // *Loading basic info:
   loadMyIp();
   loadPreviousChats();

   // *Loading previous target ip:
   $('#ip-input')
      .val(localStorage.getItem(TARGET_IP_KEY))
      .focus();

   // *Adding listener on 'message-received' ipcRenderer's channel:
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



/**
 * confirmBtn onclick listener
 */
function confirmBtn_onClick(){
   var ip = $('#ip-input').val().trim();

   if(ip.length > 0){
      localStorage.setItem(TARGET_IP_KEY, ip);

      window.location.href = '../html/client.html';
   }
}



/**
 * Loads previous chats and add them on the feed
 */
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



/**
 * Adds a 'chatData' item on the feed
 */
function onChat(chatData){
   disableNoChatsText();
   var row = getChatRow(chatData);
   $('#chat-list').append(row);
   updateLastMessage(chatData);

   // *Adding onclick listener to this item:
   row.off('click');
   row.on('click', function(e){
      var ip = $(this).attr('data-ip');

      localStorage.setItem(TARGET_IP_KEY, ip);
      window.location.href = '../html/client.html';
   });
}



/**
 * Hides 'no-chats-span' text from the feed
 */
function disableNoChatsText(){
   if(!noChatsSpanDisabled){
      $('#no-chats-span').fadeOut(200);
      noChatsSpanDisabled = true;
   }
}



/**
 * Returns a DOM item representing an incoming chat on the feed
 */
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



/**
 * Updates the chat's DOM item with its last text sent
 */
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
