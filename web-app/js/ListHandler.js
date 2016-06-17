
/*
 *
 * @param list_dom The jQuery DOM element that represents the list body.
 * @param rowFactory_func A factory function that receives a data object and returns its representing DOM element.
 * @param itemEquality_func A function that receives two data objects, and compares if they are equals or not.
 */
function ListHandler(list_dom, rowFactory_func, itemEquality_func){
   this.array = [];
   this.list_dom = list_dom;
   this.rowFactory_func = rowFactory_func;
   this.itemEquality_func = itemEquality_func;

   this.emptyTextEnabled_flag = true;
   this.emptyText_dom = this.list_dom.children('.empty-list-text');
}



ListHandler.prototype.update = function(newList){
   var reAttachingArray_dom = [];

   // *Detaching all elements first:
   var array_dom = this.list_dom.children('li').detach();

   // *Chacking if the elemets was present before:
   for(var i=0; i<newList.length; i++){
      var oldIndex = this.findIndex(this.array, newList[i]);
      if(oldIndex >= 0){
         // *If this dom element was present before:
         // *Just move it to its new position:
         reAttachingArray_dom[i] = array_dom[oldIndex];
      } else{
         // *If it wasn't present:
         // *Generates a new one:
         reAttachingArray_dom[i] = this.rowFactory_func(newList[i]);
      }
   }

   // *Attaching the dom elements based on the reAttachingArray_dom:
   for(var j=0; j<reAttachingArray_dom.length; j++){
      if(reAttachingArray_dom[j]){
         this.list_dom.append(reAttachingArray_dom[j]);
      }
   }

   this.array = newList.slice(0);
   this.onUpdate();
};



ListHandler.prototype.join = function(newList){
   this.update(this.array.concat(newList));
};



ListHandler.prototype.onUpdate = function(){
   // *Displaying the emptyText if list is empty:
   this.enableEmptyText(this.array.length===0);
};


/*
 * Finds an item's index on current listing
 *    - It will use the 'itemEquality_func' to compare each item
 * @param array Array to find the item
 * @param item The item to find for
 * @return The found index, or -1 if couldn't find it
 */
ListHandler.prototype.findIndex = function(array, item){
   return array.findIndex(val => this.itemEquality_func(val, item));
};



ListHandler.prototype.enableEmptyText = function(enable){
   if(enable != this.emptyTextEnabled_flag){
      if(enable){
         this.emptyText_dom.fadeIn(250);
      } else{
         this.emptyText_dom.fadeOut(250);
      }
      this.emptyTextEnabled_flag = enable;
   }
};



ListHandler.prototype.clearList = function(){
   this.list_dom.children('li').remove();
   this.array = [];
   this.onUpdate();
};



ListHandler.prototype.click = function(click_func){
   this.list_dom.off('click', 'li');
   this.list_dom.on('click', 'li', click_func);
   return this;
};



ListHandler.prototype.getArray = function(){
   return this.array;
};
