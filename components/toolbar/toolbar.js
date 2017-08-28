define(["knockout", "jquery", "data", "text!toolbar.html"], function(ko, $, ProductsData, toolbarTemplate) {
    'use strict';

    var productsList = new ProductsData();

    function ToolbarViewModel() {
        var self = this;
        var sortOptions = [
        {
            Name: "Name",
            Value: "name",
            Sort: function(left, right) { return compareCaseInsensitive(left.name.toUpperCase(), right.name.toUpperCase()); }
        },
        {
            Name: "Price",
            Value: "price",
            Sort: function(left, right) { return compareCaseInsensitive(Number(left.price), Number(right.price)); }
        }
        ];
        var search = {
            Type: "text",
            Value: ko.observable(""),
            RecordValue: function(record) { return record.name; }
        };
        self.products = productsList.getData();
        self.sorter = new SorterModel(sortOptions, self.products);
        productsList.setData(self.sorter.orderedRecords);
    }

    function SorterModel(sortOptions, records) {
        var self = this;
        self.records = getObservableArray(records);
        self.sortOptions = ko.observableArray(sortOptions);
        self.recordCount = ko.computed(function() { return self.records().length; }).extend({ throttle: 20 }).extend({ throttle: 5 });
        self.pageSizeOptions = ko.observableArray([1, 5, 25, 50, 100, 250, 500]);
        self.currentPageSize = ko.observable(25);
        self.sortDirections = ko.observableArray([
        {
            Name: "Asc",
            Value: "Asc",
            Sort: false
        },
        {
            Name: "Desc",
            Value: "Desc",
            Sort: true
        }]);
        self.currentSortOption = ko.observable(self.sortOptions()[0]);
        self.currentSortDirection = ko.observable(self.sortDirections()[0]);
        var records = self.records();
        self.currentPageSize.subscribe(function (pageSize) {
            amplify.publish("pageSize", pageSize);
        });
        self.orderedRecords = ko.computed(function() {
            var records = self.records();
            var sortOption = self.currentSortOption();
            var sortDirection = self.currentSortDirection();
            if (sortOption == null || sortDirection == null) { return records; }
            var sortedRecords = records.slice(0, records.length);
            sortArray(sortedRecords, sortDirection.Sort, sortOption.Sort);
            self.currentPageSize();
            return sortedRecords;
        }).extend({ throttle: 5 });
    }

    function getObservableArray(array) {
        if (typeof(array) == 'function') {
            return array;
        }
        return ko.observableArray(array);
    }

    function sortArray(array, direction, comparison) {
        if (array == null) {
            return [];
        }

        for (var oIndex = 0; oIndex < array.length; oIndex++) {
            var oItem = array[oIndex];
            for (var iIndex = oIndex + 1; iIndex < array.length; iIndex++) {
                var iItem = array[iIndex];
                var isOrdered = comparison(oItem, iItem);
                if (isOrdered == direction) {
                    array[iIndex] = oItem;
                    array[oIndex] = iItem;
                    oItem = iItem;
                }
            }
        }
        return array;
    }

    function compareCaseInsensitive(left, right) {
        if (left == null) {
            return right == null;
        } else if (right == null) {
            return false;
        }
        return left <= right;
    }

    return {
        viewModel: ToolbarViewModel,
        template: toolbarTemplate
    };
});