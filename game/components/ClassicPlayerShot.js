define([
    'underscore',
    'crafty',
    'game/constants/ClassicPlayer'
], function (_, Crafty, ClassicPlayerConstants) {

    Crafty.c("ClassicPlayerShot",
    {
        init: function() {
            this.requires("2D, DOM, classic_shellSprite, Collision");
            this.stop();
            return this.checkHits('ClassicAlien, ClassicShip, ClassicShield, ClassicAlienShot, ClassicSpaceship');
        },
        fireFrom: function(x, y) {
            this.attr({
                x: x,
                y: y,
                visible: true
            });
            this.bind("EnterFrame", this.advance);
            this.active = true;
            return this;
        },
        advance: function() {
            this.move('n', ClassicPlayerConstants.SHOT_SPEED);
            if (this.outsidePlayfield()) {
                this.stop();
            }
            return this;
        },
        stop: function() {
            this.attr({
                x: ClassicPlayerConstants.SHOT_IDLE_X,
                y: ClassicPlayerConstants.SHOT_IDLE_Y,
                visible: false
            });
            this.unbind("EnterFrame", this.advance);
            this.active = false;
            Crafty.trigger("ShotStopped", this);
            return this;
        },
        isActive: function() {
            return this.active;
        },
        outsidePlayfield: function() {
            return this.y < 0;
        }
    });

});