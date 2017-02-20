﻿define([
        'underscore',
        'crafty',
        'require',
        'game/config',
        'collections/scenes',
        'storage',
        'game/ext/test'
    ],
    function (_, Crafty, require, gameConfig, Scenes, storage) {
        var Game,
            slice = [].slice;

        Game = {
            paused: false,
            firstLevel: 'intro',
            config: gameConfig,
            togglePause: function () {
                this.paused = !this.paused;
                if (this.paused) {
                    Crafty('Delay').each(function () {
                        return this.pauseDelays();
                    });
                    Crafty("Tween").each(function () {
                        return this.pauseTweens();
                    });
                    Crafty("Particles").each(function () {
                        return this.pauseParticles();
                    });
                    Crafty('SpriteAnimation').each(function () {
                        return this.pauseAnimation();
                    });
                    Crafty('PlayerControlledShip').each(function () {
                        if (!this.disableControls) {
                            this.disabledthroughPause = true;
                            return this.disableControl();
                        }
                    });
                    return Crafty.trigger('GamePause', this.paused);
                } else {
                    Crafty('Delay').each(function () {
                        return this.resumeDelays();
                    });
                    Crafty('Tween').each(function () {
                        return this.resumeTweens();
                    });
                    Crafty('Particles').each(function () {
                        return this.resumeParticles();
                    });
                    Crafty('SpriteAnimation').each(function () {
                        return this.resumeAnimation();
                    });
                    Crafty('PlayerControlledShip').each(function () {
                        if (this.disabledThroughPause) {
                            this.disabledThroughPause = null;
                            return this.enableControl();
                        }
                    });
                    return Crafty.trigger('GamePause', this.paused);
                }
            },
            start: function () {
                var handler, settings;
                this.resetCredits();

                settings = this.settings();
                if (settings.sound === false) {
                    Crafty.audio.mute();
                }

                Crafty.bind('EnterFrame', function () {
                    if (Game.paused) {
                        return;
                    }
                    return Crafty.trigger.apply(Crafty, ['GameLoop'].concat(slice.call(arguments)));
                });

                Crafty.paths({ audio: "assets/sounds/", images: "assets/images/" });
                Crafty.init(gameConfig.viewport.width, gameConfig.viewport.height);
                Crafty.background('#000000');

                //Crafty.e('KeyboardControls, PlayerAssignable').controls({
                //    fire: Crafty.keys.SPACE,
                //    switchWeapon: Crafty.keys.PERIOD,
                //    "super": Crafty.keys.ENTER,
                //    up: Crafty.keys.UP_ARROW,
                //    down: Crafty.keys.DOWN_ARROW,
                //    left: Crafty.keys.LEFT_ARROW,
                //    right: Crafty.keys.RIGHT_ARROW,
                //    pause: Crafty.keys.P
                //});
                //Crafty.e('KeyboardControls, PlayerAssignable').controls({
                //    fire: Crafty.keys.G,
                //    switchWeapon: Crafty.keys.H,
                //    up: Crafty.keys.W,
                //    down: Crafty.keys.S,
                //    left: Crafty.keys.A,
                //    right: Crafty.keys.D,
                //    pause: Crafty.keys.Q
                //});

                this.changeScene('loading');
            },
            resetCredits: function() {
                return this.credits = 2;
            },
            changeScene: function (name) {
                Scenes.findByName(name).load(this);
            },
            settings: function() {
                var data, settings;
                data = storage.get('CM_settings');
                settings = {};

                if (data) {
                    settings = JSON.parse(data);
                }

                return _.defaults(settings,
                {
                    sound: true
                });
            },
            changeSettings: function(changes) {
                var newSettings, str;
                if (changes == null) {
                    changes = {};
                }
                newSettings = _.defaults(changes, this.settings());
                str = JSON.stringify(newSettings);
                return storage.set('CM_settings', str);
            },
            testExt: require('game/ext/test')
        };

        //_.extend(Game.LazerScript.prototype, Game.ScriptModule.Core, Game.ScriptModule.Level, Game.ScriptModule.Colors, Game.ScriptTemplate.Level);
        //_.extend(Game.EntityScript.prototype, Game.ScriptModule.Entity);

        return Game;
    });