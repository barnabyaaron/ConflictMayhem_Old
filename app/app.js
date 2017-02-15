define([
        'crafty',
        'game/config',
        'game/main'
    ],
    function (Crafty, gameConfig, Game) {
        var initialize = function() {
            Crafty.init(gameConfig.viewport.width, gameConfig.viewport.height);
            Crafty.paths({ images: "assets/images/", sounds: "assets/sounds/" });
            Crafty.audio.setChannels(10);

            Game.init();
        };

        return {
            initialize: initialize
        };
    });