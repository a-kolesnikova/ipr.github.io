define(["knockout", "text!footer.html"], function (ko, footerTemplate) {
    'use strict';
    function FooterViewModel() {
        var self = this;
    }
    return {
        viewModel: FooterViewModel,
        template: footerTemplate
    };
});