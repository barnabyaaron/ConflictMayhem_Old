define([
        'underscore',
        'crafty',
        'storage'
],
    function (_, Crafty, storage) {
        return {
            name: "menu",
            init: function (options) {
                Crafty.background('#000 url(assets/images/earth_bg.jpg) no-repeat center center');
                Crafty.audio.play('music', -1);

                var playBtn = Crafty.e("2D, DOM, Tween, Mouse, start_button");
                var continueBtn = Crafty.e("2D, DOM, Tween, Mouse, continue_button");
                var classicBtn = Crafty.e("2D, DOM, Tween, Mouse, classic_button");

                playBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 2,
                    w: 368,
                    h: 70
                })
                .bind("MouseOver", function () {
                    playBtn.sprite("start_button_hover");
                })
                .bind("MouseOut", function () {
                    playBtn.sprite("start_button");
                })
                .bind("MouseDown", function () {
                    playBtn.sprite("start_button_click");
                })
                .bind("Click", function() {
                    Crafty.audio.stop();
                    options.changeScene('intro');
                });

                continueBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 2.7,
                    w: 368,
                    h: 50,
                    visible: false
                })
                .bind("MouseOver", function () {
                    continueBtn.sprite("continue_button_hover");
                })
                .bind("MouseOut", function () {
                    continueBtn.sprite("continue_button");
                })
                .bind("MouseDown", function() {
                    continueBtn.sprite('continue_button_click');
                })
                .bind("Click", function () {
                    Crafty.audio.stop();

                    // @TODO go to saved level
                });

                if (storage.get('level') > 1) {
                    continueBtn.visible = true;
                }

                classicBtn.attr({
                    x: options.config.viewport.width / 2 - 184,
                    y: options.config.viewport.height / 5 * 4,
                    w: 368,
                    h: 50,
                    visible: false
                })
                .bind("MouseOver", function () {
                    classicBtn.sprite("classic_button_hover");
                })
                .bind("MouseOut", function () {
                    classicBtn.sprite("classic_button");
                })
                .bind("MouseDown", function () {
                    classicBtn.sprite('classic_button_click');
                })
                .bind("Click", function () {
                    Crafty.audio.stop();
                    options.changeScene('classic');
                });

                if (storage.get('classic_mode_unlocked') === true) {
                    classicBtn.visible = true;
                }
            },
            uninit: function () { }
        };
    });