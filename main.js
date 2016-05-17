const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;

var server = null;


app.on('ready', function(){
   var mainWindow = new BrowserWindow({
         title: "",
         center: true,
         frame: true,
         width: 500,
         height: 600
      });

   mainWindow.on('show', (e)=>{
      var bodyParser = require('body-parser');
      var express = require('express');
      var express_app = express();

      express_app.use(bodyParser.json());
      express_app.use(bodyParser.urlencoded({extended: true}));

      express_app.post('/message/send', (req, res) => {
         mainWindow.webContents.send('message-received', req.body);
         res.send({});
      });

      // *Debug only:
      express_app.get('/message/send/:message', (req, res) => {
         var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
         console.log(clientIp);
         var messageData = {
            ip: clientIp,
            target: require('internal-ip').v4(),
            message: req.params.message,
            time: getHour()
         };
         mainWindow.webContents.send('message-received', messageData);
         res.send("mensagem para " + messageData.target + " enviada: \"" + messageData.message + "\"");
      });
      express_app.get('/message/alive', (req, res) => {
         res.send('HTTP-comm está vivo e operante!');
      });


      server = express_app.listen(3000);
      server.timeout = 5000;
   });

   mainWindow.setMenu(null);
   mainWindow.loadURL('file://' + __dirname + '/html/index.html');
   mainWindow.show();
});


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
