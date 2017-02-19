define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('ScrollBackground',
        {
            init: function() {
                this.requires('2D, Edge, Collision, Acceleration');
                this.shakes = [];
                this.motions = [];
                this.attr({
                    x: 0,
                    y: 0,
                    w: Crafty.viewport.width,
                    h: 2,
                    speed: {
                        x: 0,
                        y: 0
                    }
                });

                this.backgroundEnd = Crafty.e('2D, ScrollFront, Edge').attr({
                    x: 0,
                    y: -(Crafty.viewport.y - Crafty.viewport.height) - 3,
                    h: 12,
                    w: Crafty.viewport.width
                });
                this.attach(this.backgroundEnd);

                this.backgroundLeft = Crafty.e('2D, Edge, Collision').attr({
                    x: 40,
                    y: 0,
                    h: Crafty.viewport.height,
                    w: 2
                });
                this.attach(this.backgroundLeft);

                this.backgroundRight = Crafty.e('2D, Edge, Collision').attr({
                    x: Crafty.viewport.width - 2,
                    y: 0,
                    h: Crafty.viewport.height,
                    w: 2
                });
                this.attach(this.backgroundRight);

                return this.bind('GameLoop',
                    function(fd) {
                        var cameraPan, coords, coordsAfter, coordsBefore, deltaX, deltaY, i, index, j, motion, ref, ref1, shake, speedX, speedY, x, xShift, y, yShift;
                        speedX = this._currentSpeed.x;
                        speedY = this._currentSpeed.y;
                        this.updateAcceleration();
                        this.x += (speedX / 1000.0) * fd.dt;
                        this.y += (speedY / 1000.0) * fd.dt;
                        xShift = 0;
                        yShift = y;
                        ref = this.shakes;
                        for (index = i = ref.length - 1; i >= 0; index = i += -1) {
                            shake = ref[index];
                            shake.easing.tick(fd.dt);
                            coords = shake.coords(shake.easing.value());
                            xShift += coords[0];
                            yShift += coords[1];
                            if (shake.easing.complete) {
                                this.shakes.splice(index, 1);
                            }
                        }

                        cameraPan = {
                            x: 0,
                            y: 0
                        };
                        ref1 = this.motions;
                        for (index = j = ref1.length - 1; j >= 0; index = j += -1) {
                            motion = ref1[index];
                            coordsBefore = motion.coords(motion.easing.value());
                            motion.easing.tick(fd.dt);
                            coordsAfter = motion.coords(motion.easing.value());
                            deltaX = coordsAfter[0] - coordsBefore[0];
                            deltaY = coordsAfter[1] - coordsBefore[1];
                            cameraPan.x += deltaX;
                            cameraPan.y += deltaY;
                            this.x += deltaX;
                            this.y += deltaY;
                            if (motion.easing.complete) {
                                this.motions.splice(index, 1);
                            }
                        }
                        x = this.x + xShift;
                        y = this.y + yShift;
                        if (Crafty.viewport.y !== -y) {
                            Crafty.viewport.y = -y;
                        }
                        if (Crafty.viewport.x !== -x) {
                            Crafty.viewport.x = -x;
                        }
                        Crafty.viewport.xShift = xShift;
                        Crafty.viewport.yShift = yShift;
                        Crafty.trigger('CameraMove', {
                            x: Math.round(this.x),
                            y: Math.round(this.y),
                            panning: cameraPan
                        });
                        return Crafty.trigger('ViewportMove', {
                            x: Math.round(x),
                            y: Math.round(y)
                        });
                    });
            },
            screenShake: function(amount, duration) {
                return this.shakes.push({
                    amount: amount,
                    duration: duration,
                    shakeX: Math.ceil(duration / 100),
                    shakeY: Math.ceil(duration / 200),
                    easing: new Crafty.easing(duration, 'linear'),
                    startX: Math.random() > 0.5 ? -1 : 1,
                    startY: Math.random() > 0.5 ? -1 : 1,
                    coords: function (v) {
                        var shakeX, shakeY;
                        shakeX = Math.cos((Math.PI / 2) + (v * this.shakeX * (Math.PI / 2)));
                        shakeY = Math.cos((Math.PI / 2) + (v * this.shakeY * (Math.PI / 2)));
                        return [shakeX * amount * this.startX, shakeY * amount * this.startY];
                    }
                });
            },
            cameraPan: function(options) {
                var ref, ref1;
                return this.motions.push({
                    easing: new Crafty.easing(options.duration, 'easeInOutQuad'),
                    x: (ref = options.x) != null ? ref : 0,
                    y: (ref1 = options.y) != null ? ref1 : 0,
                    coords: function (v) {
                        return [this.x * v, this.y * v];
                    }
                });
            },
            scrollBackground: function(speed, options) {
                if (options == null) {
                    options = {};
                }
                return this.targetSpeed(speed, options);
            },
            setWidth: function(deltaX) {
                this.x += deltaX;
                return Crafty.viewport.x = -this.x;
            },
            setAllowPushing: function(allowPushing) {
                this.allowPushing = allowPushing;
            },
            off: function() {
                this.backgroundEnd.removeComponent('Edge');
                return this.unbind('GameLoop');
            },
            remove: function() {
                return this.unbind('GameLoop');
            }
        });
    });