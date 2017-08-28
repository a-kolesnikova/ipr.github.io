define(["knockout","data","text!header.html"], function(ko, ProductsData, headerTemplate) {
    'use strict';
    function HeaderViewModel() {
        var productsList = new ProductsData();
        var self = this;
        var search = {
            Type: "text",
            Value: ko.observable(""),
            RecordValue: function(record) { return record.name; }
        };
        self.products = amplify.store("products");
        self.search = new SearchModel(search, self.products);
        productsList.setData(self.search.searchedRecords);
    }

    function SearchModel(search, records) {
        var self = this;
        self.records = getObservableArray(records);
        amplify.store("products", null);
        self.currentValue = ko.observable("");
        self.IsFiltered = function(value, recordValue, record) {
            var filterValue = value;
            filterValue = filterValue.toUpperCase();
            var recordValue = recordValue;
            recordValue = recordValue.toUpperCase();
            return recordValue.indexOf(filterValue) == -1;
        };
        self.searchedRecords = ko.computed(function() {
            var records = self.records();
            var searchedRecords = [];
            var currentValue = self.currentValue();
            for (var rIndex = 0; rIndex < records.length; rIndex++) {
                var isIncluded = true;
                var record = records[rIndex];
                var isFiltered = self.IsFiltered(currentValue, search.RecordValue(record), record);
                if (isFiltered) {
                    isIncluded = false;
                }
                if (isIncluded) {
                    searchedRecords.push(record);
                }
            }
            return searchedRecords;
        }).extend({ throttle: 5 });
    }

    function getObservableArray(array) {
        if (typeof(array) == 'function') {
            return array;
        }
        return ko.observableArray(array);
    }
    return {
        viewModel: HeaderViewModel,
        template: headerTemplate
    };
});