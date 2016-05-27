$(document).ready(function(){



   // *When user wants to submit register form:
   $('#register-form').submit(function(e){
      e.preventDefault();


      // *When register channel responds:
      socket.once('register-user-response', (registerOK) => {
         if(registerOK){
            // *If registering was OK, it backs to login section:
            dom_cleanInputs_registerSection();
            slideAuthPanel(PANEL_LEFT);
            // TODO show successful message
         } else {
            // TODO display failure message
         }
      });


      // *Tries to register:
      socket.emit('register-user-request', {
         name: $('#register-name-input').val(),
         login: $('#register-login-input').val(),
         password: $('#register-password-input').val()
      });
   });



   // *When user wants to go back to login section:
   $('#register-cancel-button').click(function(e){
      dom_cleanInputs_registerSection();
      slideAuthPanel(PANEL_LEFT);
   });
});
