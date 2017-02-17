define([
    'underscore',
    'crafty',
    'game/constants/ClassicPlayer'
], function (_, Crafty, ClassicPlayerConstants) {

    Crafty.c("ClassicPlayerCannon",
    {
        init: function() {
            this.requires("ClassicPlayerCommon, classic_cannonSprite, SpriteAnimation");
            this.reel("Fire", ClassicPlayerConstants.FIRE_ANIMATION_DURATION, 0, 0, 7);
            this.reel("Reload", ClassicPlayerConstants.RELOAD_ANIMATION_DURATION, 6, 0, -7);
            return this.bind("AnimationEnd", this.reload);
        },
        fire: function() {
            return this.animate("Fire");
        },
        reload: function(reel) {
            if (reel.id === "Fire") {
                return this.animate("Reload");
            }
        }
    });

});