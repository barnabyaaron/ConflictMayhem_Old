define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Invincible',
        {
            init: function() {
                return this.requires('Delay');
            },
            _blink: function() {
                if (this.blinkOn == null) {
                    this.blinkOn = true;
                }
                this.blinkOn = !this.blinkOn;
                if (this.blinkOn) {
                    return this.alpha = .5;
                } else {
                    return this.alpha = 1.0;
                }
            },
            remove: function() {
                return this.cancelDelay(this._blink);
            },
            invincibleDuration: function(duration) {
                this.delay(this._blink, 250, -1);
                if (duration === -1) {
                    return this;
                }
                this.delay(function () {
                    return this.removeComponent('Invincible');
                }, duration, 0);
                return this;
            }
        });
    });