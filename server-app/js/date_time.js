var getFormattedDate = function(dateToFormat){
   var d = new Date(dateToFormat || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

   month = month.length<2 ? '0' + month:month;
   day = day.length<2 ? '0' + day:day;

   var date = [day, month, year].join('/');
   return date;
};

var getFormattedTime = function(dateToFormat){
   var d = new Date(dateToFormat || Date.now()),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

   hours = hours.length<2 ? '0' + hours:hours;
   minutes = minutes.length<2 ? '0' + minutes:minutes;
   seconds = seconds.length<2 ? '0' + seconds:seconds;

   var time = [hours, minutes, seconds].join(':');
   return time;
};

var getFormattedDateTime = function(dateToFormat){
   return getFormattedDate(dateToFormat) + ' - ' + getFormattedTime(dateToFormat);
};

module.exports = {
   getFormattedTime: getFormattedTime,
   getFormattedDate: getFormattedDate,
   getFormattedDateTime: getFormattedDateTime
};
