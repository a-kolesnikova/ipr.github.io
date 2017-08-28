define(['knockout','amplify'], function(ko, amplify) {
    'use strict';
    ko.components.register('side-bar', {
        require: 'sidebar'
    });
    ko.components.register('toolbar', {
        require: 'toolbar'
    });
    ko.components.register('header', {
        require: 'header'
    });
    ko.components.register('products-list', {
        require: 'products-list'
    });
    ko.components.register('footer', {
        require: 'footer'
    });
    ko.applyBindings();

    function ProductModel(data) {
        if (!data) {
            data = {};
        }
        var self = this;
        self.name = data.name;
        self.price = data.price;
        var productImages = data.images;
        var previewImage;
        if (!productImages.length > 0) {
            previewImage = "images/no-thumb.png";
        } else {
            productImages.map(function(image, i) {
                if (i == 0) {
                    if(image.url) {
                        previewImage = image.url;
                    }
                }
            });
        }
        self.imageSrc = previewImage;
        self.shortDescription = data.short_description;
    }
    $.getJSON("../products.json", function(response) {
        if (response.constructor === Object) {
            var arrayOfProducts = [];
            for (var product in response) {
                var dataCopy = response[product];
                arrayOfProducts.push(dataCopy);
            }
            var testData = {
                customers: arrayOfProducts
            }
            var products = extractModels(self, testData.customers, ProductModel);
            amplify.store("products", products);
        } else if (response.constructor === Array) {
            var testData = {
                customers: response
            }
            var products = extractModels(self, testData.customers, ProductModel);
            amplify.store("products", products);
        }
    });

    function extractModels(parent, data, constructor) {
        var models = [];
        if (data == null) {
            return models;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];
            var model = new constructor(row, parent);
            models.push(model);
        }

        return models;
    }
});




