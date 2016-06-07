
$(document).ready(function(){
   $('#login-login-input').focus();


   // *Checking last auth:
   var lastAuth = getItem(LAST_AUTH_STORAGE_KEY);
   if(!lastAuth){
      // *If it wasn't set yet:
      lastAuth = {
         login: '',
         password: '',
         ok: false
      };
      setItem(LAST_AUTH_STORAGE_KEY, lastAuth);
   } else if(lastAuth.ok){
      // *If last login was successful:
      // *Trying to do automatic login with stored login and password:
      sendLoginRequest(lastAuth.login, lastAuth.password);
   }



   // *When submit login form:
   $('#login-form').submit(function(e){
      e.preventDefault();
      // *Trying to login with login and password given by the user:
      sendLoginRequest($('#login-login-input').val(), $('#login-password-input').val());
   });



   // *When user wants to open register section:
   $('#login-register-button').click(function(e){
      dom_cleanInputs_loginSection();
      slideAuthPanel(PANEL_RIGHT);
   });
});



/*
 * Sends login request to the server, and listens for its response
 * @param vLogin The user's login
 * @param vPassword The user's password
 */
function sendLoginRequest(vLogin, vPassword){
   // *Storing the atempt on cache:
   setItem(LAST_AUTH_STORAGE_KEY, {
      login: vLogin,
      password: vPassword,
      ok: false
   });


   socket.once('login-err-response', (errMsg) => {
      // *Updating the last auth status:
      updateAuthStatus(false);
      // TODO display error message
      console.log(errMsg);
   });
   socket.once('login-ok-response', (res) => {
      // *Updating the last auth status:
      updateAuthStatus(true);

      // *Hiding login section:
      dom_cleanInputs_loginSection();
      enableAuthPanel(false);

      // *Saving current user's id:
      currentUserId = res.id;

      updateUserNameText(res.name);
   });


   // *Sending login request:
   socket.emit('login-request', {
      login: vLogin,
      password: vPassword
   });

   // TODO block login-form, until response
}
