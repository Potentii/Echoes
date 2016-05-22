const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;

var server = null;


app.on('ready', function(){
   // *When this application is ready:

   // *Building the BrowserWindow object:
   var mainWindow = new BrowserWindow({
         title: "",
         center: true,
         frame: true,
         width: 500,
         height: 600
      });


   // *When mainWindow show up:
   mainWindow.on('show', (e)=>{
      // *Requiring express's modules:
      var bodyParser = require('body-parser');
      var express = require('express');

      // *Getting the app server instance:
      var express_app = express();

      // *Adding body-parser to express server:
      express_app.use(bodyParser.json());
      express_app.use(bodyParser.urlencoded({extended: true}));


      // *Listening to '/message/send' channel on POST action:
      express_app.post('/message/send', (req, res) => {
         // *Telling to render process that a message was received:
         mainWindow.webContents.send('message-received', req.body);

         // *Sending back empty response:
         res.send({});
      });


      // *Listening to '/message/send' channel on GET action:
      express_app.get('/message/send/:message', (req, res) => {
         var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
         console.log(clientIp);
         var messageData = {
            ip: clientIp,
            target: require('internal-ip').v4(),
            message: req.params.message,
            time: getHour()
         };
         // *Telling to render process that a message was received:
         mainWindow.webContents.send('message-received', messageData);

         // *Sending back the response to requester:
         res.send("Message sent to " + messageData.target + ": \"" + messageData.message + "\"");
      });


      // *Listening to '/message/alive' channel on GET action:
      express_app.get('/message/alive', (req, res) => {
         res.send('HTTP-comm is alive and working!');
      });


      // *Setting the server port:
      server = express_app.listen(3000);
   });


   // *Loading the mainWindow window:
   mainWindow.setMenu(null);
   mainWindow.loadURL('file://' + __dirname + '/html/index.html');
   mainWindow.show();
});


/**
 * Returns the given Date formatted as HH:MM:SS
 */
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


app.on('window-all-closed', function(){
   if (process.platform != 'darwin'){
      app.quit();
   }
});
