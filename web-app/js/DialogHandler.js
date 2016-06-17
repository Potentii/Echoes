function DialogHandler(dialog_dom){
   this.dialog_dom = dialog_dom;
   this.dialogEnabled_flag = false;
}



DialogHandler.prototype.show = function(data){
   this.enableDialog(true);
   this.load(data);
};
DialogHandler.prototype.load = function(data){};



DialogHandler.prototype.hide = function(){
   this.enableDialog(false);
   this.unload();
};
DialogHandler.prototype.unload = function(){};



DialogHandler.prototype.enableDialog = function(enable){
   enable_dom(enable, this.dialogEnabled_flag, this.dialog_dom);

   var that = this;
   if(enable){
      this.dialog_dom.on('click', function(e){
         if(this == e.target || $(e.target).hasClass('dialog-container')){
            that.hide();
         }
      });

      /*
      this.dialog_dom.on('click', '.button-container > button', () => {
         that.hide();
      });*/

   } else{
      this.dialog_dom.off('click');
   }


   this.dialogEnabled_flag = enable;
};
