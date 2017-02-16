define([
        'underscore',
        'crafty',
        'collections/scenes',
        'game/config'
    ],
    function(_, Crafty, Scenes, gameConfig) {
        return {
            init: function () {
                this.config = gameConfig;

                // Start Game
                Scenes.findByName("loading").load(this);
            },
            changeScene: function(name) {
                Scenes.findByName(name).load(this);
            }
        };
    });