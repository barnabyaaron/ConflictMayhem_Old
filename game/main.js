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
                this.paused = false;
                this.BezierPath = null;

                // Start Game
                Scenes.findByName("loading").load(this);
            },
            changeScene: function(name) {
                Scenes.findByName(name).load(this);
            },
            togglePause: function() {
                this.paused = !this.paused;
            }
        };
    });