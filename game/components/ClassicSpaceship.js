define([
    'underscore',
    'crafty',
    'storage',
    'game/constants/ClassicShip'
], function (_, Crafty, storage, ClassicShipConstants) {

    Crafty.c("ClassicSpaceship",
    {
        init: function() {
            this.requires("2D, DOM, SpriteAnimation, Collision, classic_spaceshipSprite");
            this.flying = false;
            this.explosion = Crafty.e('ClassicExplosion').explosion('classic_spaceshipExplosion', 3, 1000, 2);
            this.attr({
                x: ClassicShipConstants.IDLE_X,
                y: ClassicShipConstants.IDLE_Y,
                visible: false
            });
            this.reel("MoveRight", ClassicShipConstants.MOVEMENT_ANIMATION_DURATION, 0, 0, 12);
            return this.reel("MoveLeft", ClassicShipConstants.MOVEMENT_ANIMATION_DURATION, 11, 0, -12);
        },
        pointsWorth: function(playerShot) {
            var distanceFromCenter, factor, hitRelativeX;
            hitRelativeX = playerShot._x + playerShot._w / 2 - this._x;
            distanceFromCenter = Math.abs(this._w / 2 - hitRelativeX);
            factor = (function () {
                switch (false) {
                    case !(distanceFromCenter < 13):
                        return 10;
                    case !(distanceFromCenter < 26):
                        return 7;
                    default:
                        return 4;
                }
            })();
            return factor * 50;
        },
        destroy: function(pointsGained) {
            this.explosion.explosionText("" + pointsGained, '#FFFFFF', 10).explodeAt(this.x, this.y);
            Crafty.audio.play("classic_ship_hit");
            return this.hide();
        },
        hide: function() {
            this.attr({
                x: ClassicShipConstants.IDLE_X,
                y: ClassicShipConstants.IDLE_Y,
                visible: false
            });
            this.pauseAnimation();
            this.unbind("EnterFrame", this.advance);
            
            Crafty.audio.stop("classic_ship_fly");

            this.flying = false;
            return this;
        },
        flyTowards: function(direction) {
            this.direction = direction;
            this.flying = true;
            switch (direction) {
                case 'w':
                    this.animate("MoveLeft", -1);
                    this.attr({
                        x: Crafty.viewport.width,
                        y: ClassicShipConstants.FLIGHT_Y,
                        visible: true
                    });
                    break;
                default:
                    this.animate("MoveRight", -1);
                    this.attr({
                        x: -ClassicShipConstants.WIDTH,
                        y: ClassicShipConstants.FLIGHT_Y,
                        visible: true
                    });
            }
            this.bind("EnterFrame", this.advance);

            Crafty.audio.play("classic_ship_fly", -1);
            return this;
        },
        advance: function() {
            this.move(this.direction, ClassicShipConstants.SPEED);
            if (this.outsidePlayfield()) {
                return this.hide();
            }
        },
        outsidePlayfield: function() {
            return this.x > Crafty.viewport.width || this.x < -ClassicShipConstants.WIDTH;
        },
        isFlying: function() {
            return this.flying;
        }
    });

});