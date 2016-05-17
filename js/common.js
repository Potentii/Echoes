global.$ = require('jquery/dist/jquery');
const ipcRenderer = require('electron').ipcRenderer;

const TARGET_IP_KEY = 'target-ip';
const MESSAGES_KEY = 'messages';
const SERVER_PORT = '3000';
var myIp = null;


$(document).ready(function(){
   document.addEventListener("keydown", function(e){
      if(e.which === 123){
         // *F12
         require('electron').remote.getCurrentWindow().toggleDevTools({
            detach: true
         });
      } else if(e.which === 116){
         // *F5
         location.reload();
      }
   });

   ipcRenderer.removeAllListeners('get-message-data');
   ipcRenderer.on('get-message-data', (e, arg) => {
      e.returnValue = getMessages();
   });

});


function addMessage(message){
   var messages = getMessages();
   messages.push(message);
   localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}
function getMessages(){
   var messages = JSON.parse(localStorage.getItem(MESSAGES_KEY));
   return messages?messages:[];
}


function getHour(dateToFormat){
   var d = new Date(dateToFormat || Date.now()),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

   hours = hours.length<2 ? '0' + hours:hours;
   minutes = minutes.length<2 ? '0' + minutes:minutes;
   seconds = seconds.length<2 ? '0' + seconds:seconds;

   var time = [hours, minutes, seconds].join(':');
   return time;
}


function loadMyIp(){
   myIp = require('internal-ip').v4();
}
