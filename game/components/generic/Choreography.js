define([
        'underscore',
        'crafty',
        'game/main'
    ],
    function(_, Crafty, Game) {
        Crafty.c('Choreography', {
            init: function () {
                return this._ctypes = {
                    delay: this._executeDelay,
                    linear: this._executeLinear,
                    viewport: this._executeMoveIntoViewport,
                    viewportBezier: this._executeViewportBezier
                };
            },
            remove: function () {
                this.unbind('GameLoop', this._choreographyTick);
                if (this._currentPart == null) {
                    return;
                }
                this._currentPart = null;
                this._choreography = [];
                return this.trigger('ChoreographyEnd');
            },
            choreography: function (c, options) {
                var part, toSkip;
                if (options == null) {
                    options = {};
                }
                this.uniqueBind('GameLoop', this._choreographyTick);
                this._options = _.defaults(options, {
                    repeat: 0,
                    compensateCameraSpeed: false,
                    skip: 0
                });
                if (this._options.compensateCameraSpeed) {
                    this.camera = Crafty(Crafty('ScrollWall')[0]);
                    this._options.cameraLock = {
                        x: this.camera.x
                    };
                }
                this._choreography = c;
                this._repeated = 0;
                part = 0;
                this._setupCPart(part);
                toSkip = options.skip;
                this._toSkip = 0;
                if (toSkip > 0) {
                    while ((part < this._choreography.length - 1) && toSkip > this._currentPart.duration) {
                        toSkip -= this._currentPart.duration;
                        part += 1;
                        this._setupCPart(part);
                    }
                    this._toSkip = toSkip;
                }
                return this;
            },
            synchChoreography: function (otherComponent) {
                this._choreography = _.clone(otherComponent._choreography);
                this._options = otherComponent._options;
                this._repeated = otherComponent._repeated;
                this._toSkip = otherComponent._toSkip;
                this._currentPart = _.clone(otherComponent._currentPart);
                this._currentPart.easing = _.clone(otherComponent._currentPart.easing);
                return this.uniqueBind('GameLoop', this._choreographyTick);
            },
            _setupCPart: function (number) {
                var part;
                this._currentPart = null;
                if (!(number < this._choreography.length)) {
                    if (this._repeated < this._options.repeat || this._options.repeats === -1) {
                        this._repeated += 1;
                        number = 0;
                    } else {
                        if (this.updateMovementVisuals != null) {
                            this.updateMovementVisuals(void 0, 0, 0, 1);
                        }
                        this._choreography = [];
                        this.unbind('GameLoop', this._choreographyTick);
                        this.trigger('ChoreographyEnd');
                        return;
                    }
                }
                part = this._choreography[number];
                if (part.event != null) {
                    this.trigger(part.event, {
                        entity: this,
                        data: part.data
                    });
                }
                return this._setupPart(part, number);
            },
            _choreographyTick: function (frameData) {
                var dt, prevv, v;
                if (this._currentPart == null) {
                    return;
                }
                prevv = this._currentPart.easing.value();
                dt = frameData.dt + this._toSkip;
                this._currentPart.easing.tick(dt);
                this._toSkip = 0;
                v = this._currentPart.easing.value();
                this._ctypes[this._currentPart.type].apply(this, [v, prevv, dt]);
                if (this._options.compensateCameraSpeed) {
                    this.x += this.camera.x - this._options.cameraLock.x;
                }
                if (this._currentPart.easing.complete) {
                    return this._setupCPart(this._currentPart.part + 1);
                }
            },
            _setupPart: function (part, number) {
                var currentProperties, easingFn, k, ref, ref1;
                easingFn = (ref = part.easingFn) != null ? ref : 'linear';
                this._currentPart = _.extend(_.clone(part), {
                    part: number,
                    x: this.x,
                    y: this.y,
                    dx: part.x,
                    dy: part.y,
                    rotation: part.rotation,
                    easing: new Crafty.easing((ref1 = part.duration) != null ? ref1 : 0, easingFn)
                });
                if (part.properties) {
                    currentProperties = {};
                    for (k in part.properties) {
                        currentProperties[k] = this[k];
                    }
                    return this._currentPart.currentProperties = currentProperties;
                }
            },
            _executeLinear: function (v, prevv) {
                var dx, dy, ref, ref1, ref2, ref3;
                dx = (v * ((ref = this._currentPart.dx) != null ? ref : 0)) - (prevv * ((ref1 = this._currentPart.dx) != null ? ref1 : 0));
                dy = (v * ((ref2 = this._currentPart.dy) != null ? ref2 : 0)) - (prevv * ((ref3 = this._currentPart.dy) != null ? ref3 : 0));
                this.x += dx;
                return this.y += dy;
            },
            _executeDelay: function (v) { },
            _executeMoveIntoViewport: function (v, prevv, dt) {
                var angle, base, base1, destinationX, destinationY, diffX, diffY, dx, dy, motionX, motionY, pmotionX, pmotionY;
                destinationX = this._currentPart.dx;
                dx = 0;
                if (destinationX) {
                    if ((base = this._currentPart).moveOriginX == null) {
                        base.moveOriginX = this._currentPart.x + Crafty.viewport.x - Crafty.viewport.xShift;
                    }
                    diffX = destinationX - this._currentPart.moveOriginX;
                    motionX = diffX * v;
                    pmotionX = diffX * prevv;
                    dx = motionX - pmotionX;
                }
                destinationY = this._currentPart.dy;
                dy = 0;
                if (destinationY) {
                    if ((base1 = this._currentPart).moveOriginY == null) {
                        base1.moveOriginY = this._currentPart.y + Crafty.viewport.y - Crafty.viewport.yShift;
                    }
                    diffY = destinationY - this._currentPart.moveOriginY;
                    motionY = diffY * v;
                    pmotionY = diffY * prevv;
                    dy = motionY - pmotionY;
                }
                if (this.updateMovementVisuals != null) {
                    if (this._currentPart.rotation) {
                        angle = Math.atan2(dy, dx);
                        angle *= 180 / Math.PI;
                        angle = (angle + 360 + 180) % 360;
                    } else {
                        angle = void 0;
                    }
                    this.updateMovementVisuals(angle, dx, dy, dt);
                }
                this.x += dx;
                return this.y += dy;
            },
            _executeViewportBezier: function (v, prevv, dt) {
                var bp, c, dShiftX, dx, dy, firstCurve, i, len, p, point, ppoint, recalcDist, ref, rotation, shiftedY;
                bp = new Game.BezierPath;
                if (this._currentPart.bPath == null) {
                    p = this._currentPart.path;
                    if ((this._lastBezierPathPoint != null) && this._currentPart.continuePath) {
                        p.unshift({
                            x: this._lastBezierPathPoint.x,
                            y: this._lastBezierPathPoint.y
                        });
                    }
                    this._currentPart.bPath = bp.buildPathFrom(p);
                    if ((this._lastBezierPathPoint != null) && this._currentPart.continuePath) {
                        firstCurve = this._currentPart.bPath.curves.shift();
                        recalcDist = 0.0;
                        ref = this._currentPart.bPath.curves;
                        for (i = 0, len = ref.length; i < len; i++) {
                            c = ref[i];
                            recalcDist += c.distance;
                        }
                        this._currentPart.bPath.distance = recalcDist;
                        this._lastBezierPathPoint = null;
                    }
                    this._lastBezierPathPoint = this._currentPart.path[this._currentPart.path.length - 2];
                }
                if (this._currentPart.viewport == null) {
                    this._currentPart.viewport = {
                        y: Crafty.viewport.y
                    };
                }
                shiftedY = this._currentPart.viewport.y - Crafty.viewport.y;
                point = bp.pointOnPath(this._currentPart.bPath, v);
                ppoint = bp.pointOnPath(this._currentPart.bPath, prevv);
                if (this.shiftedX == null) {
                    this.shiftedX = 0;
                }
                dShiftX = this.shiftedX;
                this.shiftedX = Math.max(0, this.shiftedX - .5);
                dx = point.x - ppoint.x + (this.shiftedX - dShiftX);
                dy = point.y - ppoint.y;
                if (this._currentPart.rotation) {
                    rotation = bp.angleOnPath(this._currentPart.bPath, v);
                }
                if (this.updateMovementVisuals != null) {
                    this.updateMovementVisuals(rotation, dx, dy, dt);
                } else {
                    if (rotation != null) {
                        this.rotation = rotation;
                    }
                }
                this.x += dx;
                return this.y += dy;
            }
        });
    });