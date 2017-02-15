define([
        'underscore',
        'crafty',
        'game/config',
        'storage'
],
    function (_, Crafty, gameConfig, storage) {
        return {
            name: "menu",
            init: function (options) {
                var playBtn = Crafty.e("2D, DOM, Text, Tween, Mouse, button_dark");
                var continueBtn = Crafty.e("2D, DOM, Text, Tween, Mouse, button_dark");
                var classicBtn = Crafty.e("2D, DOM, Text, Tween, Mouse, button_dark");

                playBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 2,
                    w: 368,
                    h: 70
                })
                .textColor("white")
                .text("Start Mayhem")
                .textFont({
                    "family": "Silkscreen Expanded",
                    "size": "35px",
                    "lineHeight": (playBtn.h - 7) + "px"
                })
                .css({
                    "text-align": "center",
                    "vertical-align": "middle",
                    "line-height": (playBtn.h - 7) + "px"
                })
                .bind("Click", function() {
                    // Do something on click  
                    playBtn.sprite(0, 1);
                    playBtn.y += 5;
                    console.log("Start Clicked!");
                });

                continueBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 3,
                    w: 368,
                    h: 50
                })
                .textColor("white")
                .text("Continue Mayhem")
                .textFont({
                    "family": "Silkscreen Expanded",
                    "size": "26px",
                    "lineHeight": (continueBtn.h - 5) + "px"
                })
                .css({
                    "text-align": "center",
                    "vertical-align": "middle",
                    "line-height": (continueBtn.h - 5) + "px"
                })
                .bind("Click", function () {
                    // Do something on click  
                    continueBtn.sprite(0, 1);
                    continueBtn.y += 5;
                    console.log("Continue Clicked!");
                    classicBtn.alpha = 100;
                });

                classicBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 4,
                    w: 368,
                    h: 50,
                    alpha: 0
                })
                .textColor("white")
                .text("Classic Mode")
                .textFont({
                    "family": "Silkscreen Expanded",
                    "size": "26px",
                    "lineHeight": (classicBtn.h - 5) + "px"
                })
                .css({
                    "text-align": "center",
                    "vertical-align": "middle",
                    "line-height": (classicBtn.h - 5) + "px"
                })
                .bind("Click", function () {
                    // Do something on click  
                    classicBtn.sprite(0, 1);
                    classicBtn.y += 5;
                    console.log("Classic Clicked!");
                });
            },
            uninit: function () { }
        };
    });