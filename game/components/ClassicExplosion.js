define([
    'underscore',
    'crafty',
    'game/constants/ClassicExplosion'
], function (_, Crafty, ClassicExplosionConstants) {

    Crafty.c("ClassicExplosion",
    {
        init: function() {
            this.requires("2D, DOM, SpriteAnimation");
            return this.text = Crafty.e("2D, DOM, Text");
        },
        explosion: function(spriteName, repeatCount, duration, frameCount) {
            this.addComponent(spriteName);
            this.reel("Explode", duration, 0, 0, frameCount);
            this.repeatCount = repeatCount;
            this.bind("AnimationEnd", this.explosionEnded);
            this.text.unselectable().css({
                'text-align': 'center'
            });
            this.hide();
            return this;
        },
        explosionText: function(message, textColor, textSize) {
            this.message = message;
            this.textSize = textSize;
            this.text.textColor(textColor);
            this.text.textFont({
                size: this.textSize + "px",
                family: 'Silkscreen Expanded'
            });
            return this;
        },
        explodeAt: function(x, y) {
            this.attr({
                x: x,
                y: y,
                visible: true
            });
            this.animate("Explode", this.repeatCount);
            if (this.message) {
                this.text.attr({
                    visible: true,
                    x: this.x,
                    w: this.w,
                    y: Math.floor(this.y + this.h / 2 - this.textSize / 2)
                });
                this.text.text(this.message);
            }
            return this;
        },
        explosionEnded: function() {
            this.trigger("ExplosionEnded", this);
            return this.hide();
        },
        hide: function() {
            this.attr({
                x: ClassicExplosionConstants.IDLE_X,
                y: ClassicExplosionConstants.IDLE_Y,
                visible: false
            });
            this.text.attr({
                visible: false
            });
            return this;
        }
    });

});