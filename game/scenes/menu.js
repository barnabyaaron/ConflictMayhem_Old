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
                Crafty.audio.play('menu_music', -1);

                var playBtn = Crafty.e("MenuButton").create(
                    "start",
                    options.config.viewport.width / 2 - 170,
                    options.config.viewport.height / 5 * 2,
                    function() {
                        Crafty.audio.stop('menu_music');
                        options.changeScene('intro');
                    }
                );

                var continueBtn = Crafty.e("MenuButton").create(
                    "continue",
                    options.config.viewport.width / 2 - 170,
                    options.config.viewport.height / 5 * 2.7,
                    function () {
                        Crafty.audio.stop('menu_music');
                        // @TODO Continue
                    }
                ).attr({ visible: false });

                if (storage.get('level') > 1) {
                    continueBtn.visible = true;
                }

                var classicBtnText = [
                    "Classic Mode",
                    "Old Man Mode",
                    "Over 50's Mode"
                ];

                var classicBtn = Crafty.e("MenuButton").create(
                    "gold",
                    options.config.viewport.width / 2 - 170,
                    options.config.viewport.height / 5 * 4,
                    function () {
                        Crafty.audio.stop('menu_music');
                        Crafty.audio.play('classic_music');
                        
                        var classic_panel = Crafty.e('ClassicMenuPanel');
                    },
                    classicBtnText[Crafty.math.randomInt(0, (classicBtnText.length - 1))]
                ).textFont({ size: '24px', family: "Silkscreen Expanded" }).attr({ visible: false });

                //if (storage.get('classic_mode_unlocked') === true) {
                    classicBtn.visible = true;
                //}
            },
            uninit: function () { }
        };
    });