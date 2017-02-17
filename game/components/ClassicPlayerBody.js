define([
    'underscore',
    'crafty',
    'game/constants/ClassicPlayer'
], function (_, Crafty, ClassicPlayerConstants) {

    Crafty.c("ClassicPlayerBody",
    {
        init: function() {
            this.requires("ClassicPlayerCommon, classic_bodySprite, SpriteAnimation, Collision");
            this.reel("MoveRight", ClassicPlayerConstants.MOVEMENT_ANIMATION_DURATION, 0, 0, 8);
            this.reel("MoveLeft", ClassicPlayerConstants.MOVEMENT_ANIMATION_DURATION, 7, 0, -8);
            this.collision(new Crafty.polygon(12, 32, 12, 64, 52, 64, 52, 32));
            this.checkHits('ClassicAlien');
            this.bind("NewDirection", this.changedDirection);
            return this.currentFrame = 0;
        },
        changedDirection: function(info) {
            switch (info.x) {
                case 0:
                    this.pauseAnimation();
                    return this.currentFrame = this.getReel();
                case ClassicPlayerConstants.SPEED:
                    this.animate("MoveRight", -1);
                    return this.reelPosition(this.currentFrame);
                case -ClassicPlayerConstants.SPEED:
                    this.animate("MoveLeft", -1);
                    return this.reelPosition(this.currentFrame);
            }
        }
    });

});