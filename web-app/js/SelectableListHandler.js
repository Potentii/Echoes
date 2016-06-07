const MULTIPLE_SELECTION = 'multiple';
const SINGLE_SELECTION = 'single';

/*
 *
 * @param selectionMode Whether it's MULTIPLE_SELECTION or SINGLE_SELECTION
 */
function SelectableListHandler(list_dom, rowFactory_func, itemEquality_func, selectionMode){
   ListHandler.call(this, list_dom, rowFactory_func, itemEquality_func);
   this.selectionMode = selectionMode;
   this.selectedItemArray = [];


   var that = this;
   this.click(function(e){
      // *Getting the row clicked:
      var item_dom = $(this);
      // *Getting its index on list:
      var index_dom = that.list_dom.children('li').index(item_dom);
      // *Getting the data that its linked to:
      var item_selected = that.array[index_dom];

      // *Switching between selection modes:
      switch(that.selectionMode){
      case SINGLE_SELECTION:
         // *Clearing dom selection of all rows:
         that.list_dom.children('li.selected').removeClass('selected');
         // *Setting the selection only to this row data:
         that.selectedItemArray = [item_selected];
         break;

      case MULTIPLE_SELECTION:
         if(!item_dom.hasClass('selected')){
            // *If this row doesn't have 'selected' class:
            // *Add its data to selection array:
            that.selectedItemArray.push(item_selected);
         } else{
            // *If it has 'selected' class:
            // *Finding the index of its data on selection array:
            var indexToRemove = that.findIndex(that.selectedItemArray, item_selected);
            if(indexToRemove>=0){
               // *If found, remove it from selection array:
               that.selectedItemArray.splice(indexToRemove, 1);
            }
         }
         break;
      }

      // *Toggles the selection visual effect:
      item_dom.toggleClass('selected');

      // *Calling onSelectionUpdated listener:
      if(that.onSelectionUpdated_func){
         that.onSelectionUpdated_func(that.selectedItemArray, item_selected);
      }
   });
}

// *Inheritance
SelectableListHandler.prototype = Object.create(ListHandler.prototype);



SelectableListHandler.prototype.onUpdate = function(){
   ListHandler.prototype.onUpdate.call(this);

   // *Update selection
   var itemArray_dom = this.list_dom.children('li');
   itemArray_dom.removeClass('selected');
   for(var i=0; i<this.selectedItemArray.length; i++){
      // *For every item on selection array:
      // *Finding if the current list has this item:
      var index = this.findIndex(this.array, this.selectedItemArray[i]);
      if(index>=0){
         // *If it has, adds the visual effect to it:
         itemArray_dom.eq(index).addClass('selected');
      }
   }
};



ListHandler.prototype.setOnSelectionUpdatedListener = function(onSelectionUpdated_func){
   this.onSelectionUpdated_func = onSelectionUpdated_func;
   return this;
};

ListHandler.prototype.select = function(onSelectionUpdated_func){
   return this.setOnSelectionUpdatedListener(onSelectionUpdated_func);
};



SelectableListHandler.prototype.getSelectedItemArray = function(){
   return this.selectedItemArray;
};
