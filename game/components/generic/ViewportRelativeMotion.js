define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('ViewportRelativeMotion', {
            init: function () { },
            remove: function () { },
            viewportRelativeMotion: function (arg) {
                var distanceSky, newX, newY, ref, ref1, shifted, speed, x, y;
                x = arg.x, y = arg.y, speed = arg.speed, distanceSky = arg.distanceSky;
                this._distanceSky = distanceSky;
                this._startLocation = {
                    x: x,
                    y: y
                };
                this._speed = speed;
                this._initialViewport = {
                    x: Crafty.viewport.width / 4
                };
                this._location = {
                    sx: x + ((x - this._initialViewport.x) * (this._speed - 1)),
                    sy: y,
                    dx: (ref = this.dx) != null ? ref : 0,
                    dy: (ref1 = this.dy) != null ? ref1 : 0
                };
                shifted = (this._initialViewport.x - Crafty.viewport._x) * (this._speed - 1);
                newX = this._location.sx - shifted + this._location.dx;
                newY = this._location.sy - (Crafty.viewport._y * (1 - this._speed)) + this._location.dy;
                this._location.x = Math.floor(newX);
                this._location.y = Math.floor(newY);
                this.attr(this._location);
                this.motion = Crafty.bind('CameraMove', (function (_this) {
                    return function (coords) {
                        shifted = (_this._initialViewport.x + coords.x) * (_this._speed - 1);
                        newX = _this._location.sx - shifted + _this.dx;
                        if (_this._distanceSky) {
                            newY = _this._location.sy - (-coords.y * (1 - _this._speed)) + _this.dy;
                        } else {
                            newY = _this._location.sy - (-coords.y * (1 - ((_this._speed - 0.225) * 1.2))) + _this.dy;
                        }
                        return _this.attr({
                            x: newX,
                            y: newY
                        });
                    };
                })(this));
                return this;
            },
            remove: function () {
                return Crafty.unbind('CameraMove', this.motion);
            }
        });
    });