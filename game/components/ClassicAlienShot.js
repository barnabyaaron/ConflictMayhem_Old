define([
    'underscore',
    'crafty',
    'game/constants/ClassicAlienShot'
], function (_, Crafty, ClassicAlienShotConstants) {
    
    Crafty.c("ClassicAlienShot",
    {
        init: function() {
            this.requires("2D, DOM, classic_alienShot, Collision, SpriteAnimation");
            this.attr({
                visible: false
            });
            this.reel("Zap", ClassicAlienShotConstants.ZAP_INTERVAL, 0, 0, 2);
            this.checkHits('ClassicPlayerBody, ClassicShield');
            this.shotHit = (function(_this) {
                return function(hitInfo) {
                    var target;
                    target = hitInfo[0].obj;

                    if (target.has('ClassicShield')) {
                        _this.trigger('ShieldHit', target);
                    }

                    if (target.has('ClassicPlayerBody')) {
                        _this.trigger('PlayerHit', target);
                    }

                    return _this.stop();
                };
            })(this);
            this.bind("HitOn", this.shotHit);
            this.containingNode = null;
            this.containingList = null;
            return this.fired = false;
        },
        fireBy: function(alien) {
            var x, y;
            x = alien.x + alien.w / 2;
            y = alien.y + alien.h;
            this.attr({
                x: x,
                y: y,
                visible: true
            });
            this.animate("Zap", -1);
            this.bind("EnterFrame", this.advance);
            this.containingNode.remove();
            this.fired = true;
            return this;
        },
        advance: function() {
            this.move('s', ClassicAlienShotConstants.SPEED);
            if (this.outsidePlayfield()) {
                this.stop();
            }
            return this;
        },
        die: function() {
            Crafty.audio.play("classic_alien_shot_hit");
            return this.stop();
        },
        stop: function() {
            this.attr({
                x: ClassicAlienShotConstants.SHOT_IDLE_X,
                y: ClassicAlienShotConstants.SHOT_IDLE_Y,
                visible: false
            });
            this.pauseAnimation();
            this.unbind("EnterFrame", this.advance);
            if (this.fired === true) {
                this.containingNode = this.containingList.append(this);
                this.fired = false;
            }
            return this;
        },
        outsidePlayfield: function() {
            return this.y > Crafty.viewport.height;
        },
        setContainingNode: function(shotNode) {
            return this.containingNode = shotNode;
        },
        setContainingList: function(shotList) {
            return this.containingList = shotList;
        },
        pointsWorth: function() {
            return 25;
        }
    });

});