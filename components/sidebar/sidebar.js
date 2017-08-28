define(["jquery","knockout","data","text!sidebar.html"], function($, ko, ProductsData, sidebarTemplate) {
    'use strict';
    var productsList = new ProductsData();
    function SidebarViewModel() {
        var self = this;
        var filters = [{
            Type: "select",
            Name: "Price",
            Options: [
            getOption("All", "All", null),
            getOption("$50 or Less", "$50 or Less", "$50 or Less"),
            getOption("Between $50 and $100", "Between $50 and $100", "Between $50 and $100"),
            getOption("$100 or more", "$100 or more", "$100 or more")
            ],
            CurrentOption: ko.observable(),
            RecordValue: function(record) { return record.price; }
        }];
        self.products = productsList.getData();
        self.filter = new FilterModel(filters, self.products);
        productsList.setData(self.filter.filteredRecords);
    }

    function FilterModel(filters, records) {
        var self = this;
        self.records = getObservableArray(records);
        self.filters = ko.observableArray(filters);
        self.activeFilters = ko.computed (function() {
            var filters = self.filters();
            var activeFilters = [];
            for (var index = 0; index < filters.length; index++) {
                var filter = filters[index];
                if (filter.CurrentOption) {
                    var filterOption = filter.CurrentOption();
                    if (filterOption && filterOption.FilterValue != null) {
                        var activeFilter = {
                            Filter: filter,
                            IsFiltered: function(filter, record) {
                                var filterOption = filter.CurrentOption();
                                if (!filterOption) {
                                    return;
                                }
                                var recordValue = filter.RecordValue(record);
                                if (filterOption.FilterValue == '$50 or Less') {
                                    var price = parseInt(recordValue);
                                    price = price.toFixed(0);
                                    if (price <= 50) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else if (filterOption.FilterValue == 'Between $50 and $100') {
                                    var price = parseInt(recordValue);
                                    price = price.toFixed(0);
                                    if (price > 50 && price < 100) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else if (filterOption.FilterValue == '$100 or more') {
                                    var price = parseInt(recordValue);
                                    price = price.toFixed(0);
                                    if (price >= 100) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return recordValue != filterOption.FilterValue;
                                }
                            }
                        };
                        activeFilters.push(activeFilter);
                    }
                }
                else if (filter.Value) {
                    var filterValue = filter.Value();
                    if (filterValue && filterValue != "") {
                        var activeFilter = {
                            Filter: filter,
                            IsFiltered: function(filter, record) {
                                var filterValue = filter.Value();
                                filterValue = filterValue.toUpperCase();
                                var recordValue = filter.RecordValue(record);
                                recordValue = recordValue.toUpperCase();
                                return recordValue.indexOf(filterValue) == -1;
                            }
                        };
                        activeFilters.push(activeFilter);
                    }
                }
            }
            return activeFilters;
        }).extend({ throttle: 5 });

        self.filteredRecords = ko.computed(function() {
            var records = self.records();
            var filters = self.activeFilters();
            if (filters.length == 0) {
                return records;
            }
            var filteredRecords = [];
            for (var rIndex = 0; rIndex < records.length; rIndex++) {
                var isIncluded = true;
                var record = records[rIndex];
                for (var fIndex = 0; fIndex < filters.length; fIndex++) {
                    var filter = filters[fIndex];
                    var isFiltered = filter.IsFiltered(filter.Filter, record);
                    if (isFiltered) {
                        isIncluded = false;
                        break;
                    }
                }
                if (isIncluded) {
                    filteredRecords.push(record);
                }
            }
            return filteredRecords;
        }).extend({ throttle: 5 });
    }

    function getOption(name, value, filterValue) {
        var option = {
            Name: name,
            Value: value,
            FilterValue: filterValue
        };
        return option;
    }

    function getObservableArray(array) {
        if (typeof(array) == 'function'){
            return array;
        }
        return ko.observableArray(array);
    }
    return {
        viewModel: SidebarViewModel,
        template: sidebarTemplate
    };
});