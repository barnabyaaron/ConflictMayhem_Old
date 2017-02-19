define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('ViewportFixed', {
            init: function () {
                this._initialViewport = {
                    x: Crafty.viewport.x,
                    y: Crafty.viewport.y
                };
                return this.motion = Crafty.bind('CameraMove', (function (_this) {
                    return function (coords) {
                        var shiftedX, shiftedY;
                        shiftedX = _this._initialViewport.x + coords.x;
                        shiftedY = _this._initialViewport.y + coords.y;
                        if (_this.shiftedX == null) {
                            _this.shiftedX = 0;
                        }
                        _this.shiftedX = Math.max(0, _this.shiftedX - .5);
                        _this.attr({
                            x: _this.x + shiftedX + _this.shiftedX - coords.panning.x,
                            y: _this.y + shiftedY - coords.panning.y
                        });
                        return _this._initialViewport = {
                            x: -coords.x,
                            y: -coords.y
                        };
                    };
                })(this));
            },
            remove: function () {
                return Crafty.unbind('CameraMove', this.motion);
            }
        });
    });