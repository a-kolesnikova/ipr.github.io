define(["knockout","jquery","data","text!products-list.html"], function(ko, $, ProductsData, productsListTemplate) {
    'use strict';
    function ProductsListViewModel() {
        var self = this;
        var baseProductsList = new ProductsData();
        self.pager = new PagerModel(baseProductsList.getData());
    }

    function PagerModel(records) {
        var self = this;
        self.records = getObservableArray(records);
        self.currentPageIndex = ko.observable(self.records().length > 0 ? 0 : -1);
        self.currentPageSize = ko.observable(25);
        amplify.subscribe('pageSize', function (currentPageSize) {
            self.currentPageSize = ko.observable(currentPageSize);
        });
        self.recordCount = ko.computed(function() {
            return self.records().length;
        }).extend({ throttle: 5 });
        self.maxPageIndex = ko.computed(function() {
            return Math.ceil(self.records().length / self.currentPageSize()) - 1;
        }).extend({ throttle: 5 });
        self.currentPageRecords = ko.computed(function() {
            var newPageIndex = -1;
            var pageIndex = self.currentPageIndex();
            var maxPageIndex = self.maxPageIndex();
            if (pageIndex > maxPageIndex) {
                newPageIndex = maxPageIndex;
            }
            else if (pageIndex == -1) {
                if (maxPageIndex > -1) {
                    newPageIndex = 0;
                }
                else {
                    newPageIndex = -2;
                }
            }
            else {
                newPageIndex = pageIndex;
            }
            if (newPageIndex != pageIndex) {
                if (newPageIndex >= -1) {
                    self.currentPageIndex(newPageIndex);
                }
                return [];
            }
            var pageSize = self.currentPageSize();
            var startIndex = pageIndex * pageSize;
            var endIndex = startIndex + pageSize;
            return self.records().slice(startIndex, endIndex);
        }).extend({ throttle: 10 });
        self.moveFirst = function() {
            self.changePageIndex(0);
        };
        self.movePrevious = function() {
            self.changePageIndex(self.currentPageIndex() - 1);
        };
        self.moveNext = function() {
            self.changePageIndex(self.currentPageIndex() + 1);
        };
        self.moveLast = function() {
            self.changePageIndex(self.maxPageIndex());
        };
        self.changePageIndex = function(newIndex) {
            if (newIndex < 0 || newIndex == self.currentPageIndex() || newIndex > self.maxPageIndex()) {
                return;
            }
            self.currentPageIndex(newIndex);
        };
        self.onPageSizeChange = function() {
            self.currentPageIndex(0);
        };
        self.renderPagers = function() {
            var pager = "<a href=\"#\" class=\"move-first\" data-bind=\"click: pager.moveFirst, enable: pager.currentPageIndex() > 0\">&lt;&lt;</a><a href=\"#\" class=\"move-prev\" data-bind=\"click: pager.movePrevious, enable: pager.currentPageIndex() > 0\">&lt;</a><span class=\"text\">Page <span class=\"current-page\" data-bind=\"text: pager.currentPageIndex() + 1\"></span> of <span data-bind=\"text: pager.maxPageIndex() + 1\"></span></span><a href=\"#\" class=\"move-next\" data-bind=\"click: pager.moveNext, enable: pager.currentPageIndex() < pager.maxPageIndex()\">&gt;</a><a href=\"#\" class=\"move-last\" data-bind=\"click: pager.moveLast, enable: pager.currentPageIndex() < pager.maxPageIndex()\">&gt;&gt;</a>";
            $("div.pagination").html(pager);
        };
        self.renderPagers();
    }

    function getObservableArray(array) {
        if (typeof(array) == 'function') {
            return array;
        }
        return ko.observableArray(array);
    }
    
    return {
        viewModel: ProductsListViewModel,
        template: productsListTemplate
    };
});