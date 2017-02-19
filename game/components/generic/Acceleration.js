define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Acceleration', {
            init: function () {
                this._currentSpeed = {
                    x: 0,
                    y: 0
                };
                this._targetSpeed = {
                    x: 0,
                    y: 0
                };
                this._accelerate = {
                    x: .01,
                    y: .01
                };
                return this._currentAcceleration = {
                    x: 0,
                    y: 0
                };
            },
            updateAcceleration: function () {
                this._handleAcceleration('x');
                return this._handleAcceleration('y');
            },
            targetSpeed: function (speed, options) {
                if (options == null) {
                    options = {};
                }
                options = _.defaults(options, {
                    accellerate: true
                });
                if (options.accellerate) {
                    this._accelerate = {
                        x: .01,
                        y: .01
                    };
                } else {
                    this._accelerate = {
                        x: Infinity,
                        y: Infinity
                    };
                }
                if ((speed.x != null) && (speed.y != null)) {
                    this._targetSpeed.x = speed.x;
                    this._targetSpeed.y = speed.y;
                } else {
                    this._targetSpeed.x = speed;
                    this._targetSpeed.y = 0;
                }
                return this;
            },
            _handleAcceleration: function (axis) {
                var a;
                if (this._currentSpeed[axis] === this._targetSpeed[axis]) {
                    return;
                }
                a = 1;
                if (this._currentSpeed[axis] > this._targetSpeed[axis]) {
                    a = -1;
                }
                this._currentAcceleration[axis] += this._accelerate[axis] * a;
                this._currentSpeed[axis] += this._currentAcceleration[axis];
                if (this._currentAcceleration[axis] > 0 && this._currentSpeed[axis] < this._targetSpeed[axis]) {
                    return;
                }
                if (this._currentAcceleration[axis] < 0 && this._currentSpeed[axis] > this._targetSpeed[axis]) {
                    return;
                }
                this._currentSpeed[axis] = this._targetSpeed[axis];
                return this._currentAcceleration[axis] = 0;
            }
        });
    });