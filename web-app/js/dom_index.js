const PANEL_LEFT = 'left';
const PANEL_RIGHT = 'right';



$(document).ready(function(){
   $('body > .black-screen').hide();
});



/*
 * Panels enabling effect
 */
var contactPicker_enabled = false;
function enableContactPicker(enable){
   enablePanel(enable, contactPicker_enabled, $('#chat-managing-dialog'));
   addCloseListenerToDialog(enable, $('#chat-managing-dialog'), enableContactPicker);
   contactPicker_enabled = enable;
}
var addContact_enabled = false;
function enableAddContact(enable){
   enablePanel(enable, addContact_enabled, $('#add-contact-dialog'));
   addCloseListenerToDialog(enable, $('#add-contact-dialog'), enableAddContact);
   addContact_enabled = enable;
}



var authPanel_enabled = true;
function enableAuthPanel(enable){
   enablePanel(enable, authPanel_enabled, $('#auth-panel'));
   authPanel_enabled = enable;
}

var chatPanel_enabled = true;
function enableChatPanel(enable){
   enablePanel(enable, chatPanel_enabled, $('#chat-panel'));
   chatPanel_enabled = enable;
}


function enablePanel(enable, flag, panel_dom){
   if(enable != flag){
      if(enable){
         panel_dom.fadeIn(300);
      } else {
         panel_dom.fadeOut(300);
      }
   }
}


function addCloseListenerToDialog(enable, dialog_dom, enable_function){
   if(enable){
      dialog_dom.on('click', function(e){
         console.log('d');
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
