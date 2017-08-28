'use strict';

define(['knockout'], function(ko) {
  /**
  * @constructor
  */
  var ProductsData = function() {};

  ProductsData.prototype.allData = ko.observableArray();

  ProductsData.prototype.getData = function() {
    return this.allData();
  };
  
  ProductsData.prototype.setData = function(data){
    this.allData(data);
  };
  return ProductsData;
});
