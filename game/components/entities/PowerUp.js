define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('PowerUp',
        {
            init: function() {
                this.requires('2D, WebGL, ColorEffects, powerUpBox, SpriteAnimation, TweenPromise, Scalable');
                this.reel('blink', 600, [[10, 1], [11, 1], [12, 1], [11, 1]]);
                this.attr({
                    w: 32,
                    h: 32
                });
                return this.pickedUp = false;
            },
            remove: function () { },
            powerUp: function(settings) {
                var color, marking, pos, size, typeColors;
                this.settings = settings;
                this.animate('blink', -1);
                color = '#802020';
                if (this.settings.type) {
                    typeColors = {
                        weapon: '#202080',
                        weaponBoost: '#D06000',
                        weaponUpgrade: '#30B030',
                        ship: '#802020'
                    };
                    color = typeColors[this.settings.type];
                }
                this.colorOverride(color, 'partial');
                if (this.settings.icon) {
                    marking = Crafty.e('2D, WebGL, ColorEffects').addComponent(this.settings.icon).colorOverride('white', 'partial').attr({
                        w: 22,
                        h: 22,
                        x: 5,
                        y: 5
                    });
                    this.attach(marking);
                } else {
                    if (this.settings.marking) {
                        size = '16px';
                        pos = {
                            x: 8,
                            y: 8
                        };
                        if (this.settings.marking.length === 2) {
                            size = '9px';
                            pos = {
                                x: 3,
                                y: 8
                            };
                        }
                        marking = Crafty.e('2D,DOM,Text').textColor('#FFF').textFont({
                            size: size,
                            family: 'Press Start 2P'
                        }).text(this.settings.marking).attr(pos);
                        this.attach(marking);
                    }
                }
                return this;
            },
            pickup: function() {
                this.pickedUp = true;
                return this.tweenPromise({
                    scale: 1.5,
                    x: this.x - 12,
                    y: this.y - 12
                }, 120).then((function (_this) {
                    return function () {
                        return _this.tweenPromise({
                            alpha: 0,
                            scale: .3,
                            z: 20,
                            x: _this.x + 15,
                            y: _this.y + 15
                        }, 120).then(function () {
                            return _this.destroy();
                        });
                    };
                })(this));
            }
        });
    });