
$(document).ready(function(){
   // *Checking if the user is already legged in:
   var userName = storageGet_userName();
   if(userName && userName.length > 0){
      goToApp();
   } else{
      $('#register-form').submit(registerForm_onSubmit);
   }
});


function registerForm_onSubmit(e){
   e.preventDefault();
   var userName = $('#register-input').val().trim();
   if(userName.length > 0){
      storageSet_userName(userName);
      goToApp();
   }
}

function goToApp(){
   window.location.href = 'echoes/app';
}
