define([
        'crafty',
        'game/config',
        'game/main'
    ],
    function (Crafty, gameConfig, Game) {
        var initialize = function() {
            Crafty.init(gameConfig.viewport.width, gameConfig.viewport.height);
            Crafty.paths({ audio: "assets/sounds/", images: "assets/images/" });

            Game.init();
        };

        return {
            initialize: initialize
        };
    });