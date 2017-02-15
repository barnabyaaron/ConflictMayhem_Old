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
                Crafty.sprite(728, 49, "assets/images/ui/LoadingBar_fullbg.png", {
                    loadingbar: [0, 0]
                });

                Crafty.background('#000 url(assets/images/black.png) repeat left top');

                var loadingBar = Crafty.e("2D, DOM, loadingbar, Tween").attr({
                        x: 20,
                        y: options.config.viewport.height / 4 * 3 - 3,
                        w: options.config.viewport.width - 40
                    }),
                    progressBar = Crafty.e("2D, DOM, ProgressBar, Tween").attr({
                        x: 30,
                        y: options.config.viewport.height / 4 * 3,
                        w: options.config.viewport.width - 60,
                        h: 40,
                        alpha: .6
                    }).progressBar(100, false, "brown", "green");

                Assets.loadAllAssets(function() {
                    // All Assets Loaded
                    loadingBar.tween({ alpha: 0 }, 100);
                    progressBar.tween({ alpha: 0 }, 100).one("TweenEnd", function() {
                        options.changeScene('menu');
                    });
                }, function(e) {
                    // On Loading Progress
                    progressBar.updateBarProgress(e.percent);
                });
            },
            uninit: function () { }
        };
    });