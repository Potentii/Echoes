
const USER_NAME_STORAGE_KEY = "user-name";


function storageSet_userName(userName){
   localStorage.setItem(USER_NAME_STORAGE_KEY, userName);
}
function storageGet_userName(){
   return localStorage.getItem(USER_NAME_STORAGE_KEY);
}
