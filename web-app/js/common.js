const LAST_AUTH_STORAGE_KEY = "last-auth";


function getItem(key){
   return JSON.parse(localStorage.getItem(key));
}

function setItem(key, value){
   localStorage.setItem(key, JSON.stringify(value));
}

function updateAuthStatus(status){
   var auth = getItem(LAST_AUTH_STORAGE_KEY);
   auth.ok = status;
   setItem(LAST_AUTH_STORAGE_KEY, auth);
}
