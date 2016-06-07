const PANEL_LEFT = 'left';
const PANEL_RIGHT = 'right';


var addContactDialog;
var chatManagingDialog;

$(document).ready(function(){
   $('body > .black-screen').hide();

   addContactDialog = new AddContactDialog();
   chatManagingDialog = new ChatManagingDialog();
});


function updateUserNameText(name){
   $('#lobby-user-name-text').text(name);
}



/*
 * Panels enabling effect
 */
var authPanel_enabled = true;
function enableAuthPanel(enable){
   enable_dom(enable, authPanel_enabled, $('#auth-panel'));
   authPanel_enabled = enable;
}

var chatPanel_enabled = true;
function enableChatPanel(enable){
   enable_dom(enable, chatPanel_enabled, $('#chat-panel'));
   chatPanel_enabled = enable;
}


function enable_dom(enable, flag, element_dom){
   if(enable != flag){
      if(enable){
         element_dom.fadeIn(300);
      } else {
         element_dom.fadeOut(300);
      }
   }
}


function addCloseListenerToDialog(enable, dialog_dom, enable_function){
   if(enable){
      dialog_dom.on('click', function(e){
         if(this == e.target){
            enable_function(false);
         }
      });
   } else{
      dialog_dom.off();
   }
}



/*
 * Panels sliding effect
 */
var authPanel_showing = PANEL_LEFT;
function slideAuthPanel(panelSide){
   slidePanel(panelSide, authPanel_showing, $('#auth-panel'));
   authPanel_showing = panelSide;
}

var chatPanel_showing = PANEL_LEFT;
function slideChatPanel(panelSide){
   slidePanel(panelSide, chatPanel_showing, $('#chat-panel'));
   chatPanel_showing = panelSide;
}


function slidePanel(panelSide, flag, panel_dom){
   if(panelSide != flag){
      switch (panelSide) {
      case PANEL_LEFT:
         panel_dom.removeClass('left-shifted');
         break;
      case PANEL_RIGHT:
         panel_dom.addClass('left-shifted');
         break;
      }
   }
}



// *Debug only:
function arrayToString(array, value_func){
   if(!value_func){
      value_func = v => v;
   }

   var array_str = '[';
   for(var i=0; i<array.length; i++){
      array_str += value_func(array[i]);
      if(i<array.length-1){
         array_str += ', ';
      } else{
         array_str += ']';
      }
   }
   return array_str;
}
