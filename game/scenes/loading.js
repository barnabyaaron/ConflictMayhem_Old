define([
        'underscore',
        'crafty',
        'collections/assets'
    ],
    function(_, Crafty, Assets) {
        return {
            name: "loading",
            init: function (options) {

                // Loading
                Crafty.background('#000 url(assets/images/loading_bg.jpg) no-repeat center center');

                Assets.loadAllAssets(function() {
                    // All Assets Loaded
                    options.changeScene('menu');
                });
            },
            uninit: function () { }
        };
    });