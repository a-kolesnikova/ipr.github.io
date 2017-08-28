require.config({
    baseUrl: 'boot',
    paths: {
        // Libraries
        "jquery": "../lib/jquery.min",
        "knockout": "../lib/knockout",
        "text": "../lib/text",
        "init": "init",
        "amplify": "../lib/amplify.min",

        // Components
        "header": "../components/header/header",
        "footer": "../components/footer/footer",
        "products-list": "../components/products-list/products-list",
        "sidebar": "../components/sidebar/sidebar",
        "toolbar": "../components/toolbar/toolbar"
    },
    shim: {
        "amplify": {
            deps: ["jquery"],
            exports: "amplify"
        }
    }
});

require(["jquery", "knockout", "amplify", "init", "data"]);




