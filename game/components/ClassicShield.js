define([
    'underscore',
    'crafty',
    'game/constants/ClassicShield'
], function (_, Crafty, ClassicShieldConstants) {

    Crafty.c("ClassicShield",
    {
        init: function() {
            this.requires("2D, DOM, classic_shieldSprite, SpriteAnimation");
            this.reel("Degrade", 1, 0, 0, 5);
            return this.reel("Degrade");
        },
        shield: function(x, y) {
            this.spawnX = x;
            this.spawnY = y;
            return this;
        },
        degrade:function() {
            this.degradation += 1;
            if (this.degradation >= this.getReel().frames.length) {
                this.attr({
                    x: ClassicShieldConstants.IDLE_X,
                    y: ClassicShieldConstants.IDLE_Y,
                    visible: false
                });
            } else {
                this.reelPosition(this.degradation);
            }
            return this;
        },
        respawn: function() {
            this.degradation = 0;
            this.reelPosition(this.degradation);
            this.attr({
                x: this.spawnX,
                y: this.spawnY,
                visible: true
            });
            return this;
        }
    });

});