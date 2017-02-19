define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Bullet', {
            init: function () {
                this.requires('2D, WebGL, sphere1, Collision');
                return this.crop(6, 21, 18, 7);
            },
            fire: function (properties) {
                this.attr({
                    damage: properties.damage,
                    speed: properties.speed,
                    rotation: properties.direction,
                    ship: properties.ship
                }).bind('GameLoop', (function (_this) {
                    return function (fd) {
                        var dist;
                        dist = fd.dt * (_this.speed / 1000);
                        _this.x += Math.cos(properties.direction / 180 * Math.PI) * dist;
                        _this.y += Math.sin(properties.direction / 180 * Math.PI) * dist;
                        if (_this.x > _this._maxXforViewPort()) {
                            _this.destroy();
                        }
                        if (_this._minXforViewPort() > _this.x) {
                            _this.destroy();
                        }
                        if (_this._minYforViewPort() > _this.y) {
                            _this.destroy();
                        }
                        if (_this.y > _this._maxYforViewPort()) {
                            return _this.destroy();
                        }
                    };
                })(this)).onHit('Solid', function () {
                    if (Game.paused) {
                        return;
                    }
                    return this.destroy();
                });
                return this;
            },
            _maxXforViewPort: function () {
                var maxX;
                maxX = -Crafty.viewport._x + Crafty.viewport._width / Crafty.viewport._scale;
                return maxX + 10;
            },
            _minXforViewPort: function () {
                var minX;
                minX = -Crafty.viewport._x;
                return minX - 10;
            },
            _maxYforViewPort: function () {
                var maxY;
                maxY = -Crafty.viewport._y + Crafty.viewport._height / Crafty.viewport._scale;
                return maxY + 10;
            },
            _minYforViewPort: function () {
                var minY;
                minY = -Crafty.viewport._y;
                return minY - 10;
            }
        });
    });