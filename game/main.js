define([
        'underscore',
        'crafty',
        'collections/scenes',
        'game/config',
        'game/events'
    ],
    function(_, Crafty, Scenes, gameConfig, gameEvents) {
        return {
            init: function () {
                this.config = gameConfig;
                this.events = gameEvents;

                // Setup Events
                this.events.init();

                // Start Game
                Scenes.findByName("loading").load(this);
            },
            changeScene: function(name) {
                Scenes.findByName(name).load(this);
            }
        };
    });