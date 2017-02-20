var Game, generator,
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

generator = this.Game.levelGenerator;

Game = this.Game;

generator.defineElement('cloud', function () {
    var blur, c1, c2, h, s, v, w, y;
    v = Math.random();
    blur = Math.random() * 4.0;
    if (v > .2) {
        y = (Math.random() * 20) + 30;
        w = (Math.random() * 20) + 125;
        h = (Math.random() * 10) + 50;
        c1 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr({
            z: -300,
            w: w,
            h: h,
            topDesaturation: 0.6,
            bottomDesaturation: 0.6,
            alpha: (Math.random() * 0.8) + 0.2,
            lightness: .4,
            blur: blur
        });
        if (Math.random() < 0.7) {
            c1 = c1.flip('X');
        }
        this.addBackground(20 + (Math.random() * 400), y, c1, .375);
    }
    if (v < .6) {
        s = (Math.random() * .20) + .15;
        y = 230 - (s * 150);
        w = ((Math.random() * 10) + 70) - (s * 20);
        h = ((Math.random() * 5) + 20) - (s * 10);
        c2 = Crafty.e('2D, WebGL, cloud, Hideable, Horizon').attr({
            z: -570,
            w: w,
            h: h,
            topDesaturation: 1.0 - s,
            bottomDesaturation: 1.0 - s,
            alpha: (Math.random() * 0.8) + 0.2,
            lightness: .4,
            blur: blur
        });
        if (Math.random() < 0.2) {
            c2 = c2.flip('X');
        }
        return this.addBackground(60 + Math.random() * 400, y, c2, s);
    }
});

generator.defineElement('waterHorizon', function () {
    var goldenStripe, h;
    h = Crafty.e('2D, WebGL, waterHorizon, SunBlock, Horizon').attr({
        z: -600,
        w: 257
    }).colorDesaturation(Game.backgroundColor).saturationGradient(1.0, .2);
    if (Game.webGLMode === false) {
        h.attr({
            lightness: .6
        });
    }
    this.addBackground(0, this.level.visibleHeight - 225, h, .25);
    goldenStripe = Crafty.e('2D, WebGL, Gradient, GoldenStripe').topColor('#DDDD00').bottomColor('#DDDD00', Game.webGLMode !== false ? 0 : 1).attr({
        z: -599,
        w: this.delta.x * .25,
        h: 1,
        alpha: 0
    });
    return this.addBackground(0, this.level.visibleHeight - 225, goldenStripe, .25);
});

generator.defineElement('water', function () {
    var h;
    h = Crafty.e('2D, WebGL, waterMiddle, Horizon, ColorEffects').crop(1, 0, 511, 192).attr({
        z: -500,
        w: 513
    }).colorDesaturation(Game.backgroundColor).saturationGradient(.7, -.4);
    if (Game.webGLMode === false) {
        h.attr({
            lightness: .8
        });
    }
    this.addBackground(0, this.level.visibleHeight - 150, h, .5);
    return this.level.registerWaveTween('OceanWavesMiddle', 5500, 'easeInOutQuad', function (v, forward) {
        var distanceh, height, moveh;
        moveh = 5;
        distanceh = 20;
        height = 192;
        return Crafty('waterMiddle').each(function () {
            if (forward) {
                this.dy = v * moveh;
                return this.h = height - (v * distanceh);
            } else {
                this.dy = moveh - (v * moveh);
                return this.h = height - distanceh + (v * distanceh);
            }
        });
    });
});

generator.defineElement('waterFront', function () {
    var height, water1, water2;
    height = 65;
    this.add(0, this.level.visibleHeight - 45, Crafty.e('2D, Solid').attr({
        w: this.delta.x,
        h: 45
    }));
    water1 = Crafty.e('2D, WebGL, waterFront1, Wave1').attr({
        z: -20
    }).crop(0, 1, 512, 95);
    this.add(0, this.level.visibleHeight - height, water1);
    water1.originalY = water1.y;
    water2 = Crafty.e('2D, WebGL, waterFront2, Wave2').attr({
        z: -20
    }).crop(0, 1, 512, 95);
    this.add(512, this.level.visibleHeight - height, water2);
    water2.originalX = water2.x;
    water2.originalY = water2.y;
    return this.level.registerWaveTween('OceanWaves', 6000, 'easeInOutQuad', function (v, forward) {
        var distance, distanceh, moveh, width;
        distance = 50;
        distanceh = 40;
        moveh = 5;
        width = 513;
        height = 125;
        Crafty('Wave1').each(function () {
            if (forward) {
                this.w = width + (v * distance);
                this.y = this.originalY + (v * moveh);
                return this.h = height - (v * distanceh);
            } else {
                this.w = width + distance - (v * distance);
                this.y = this.originalY + moveh - (v * moveh);
                return this.h = height - distanceh + (v * distanceh);
            }
        });
        Crafty('Wave2').each(function () {
            if (forward) {
                this.w = width - (v * distance);
                this.x = this.originalX + (v * distance);
                this.y = this.originalY + (v * moveh);
                return this.h = height - (v * distanceh);
            } else {
                this.w = width - distance + (v * distance);
                this.x = this.originalX + distance - (v * distance);
                this.y = this.originalY + moveh - (v * moveh);
                return this.h = height - distanceh + (v * distanceh);
            }
        });
        return Crafty('WaveFront').each(function () {
            width = 1200;
            distance = 120;
            height = 200;
            distanceh = 80;
            if (forward) {
                this.w = width + (v * distance);
                this.y = this.originalY + (v * moveh);
                return this.h = height - (v * distanceh);
            } else {
                this.w = width + distance - (v * distance);
                this.y = this.originalY + moveh - (v * moveh);
                return this.h = height - distanceh + (v * distanceh);
            }
        });
    });
});

generator.defineElement('cityHorizon', function (mode) {
    var e;
    this.addElement('waterHorizon');
    e = mode === 'start' ? Crafty.e('2D, WebGL, ColorEffects, coastStart, SunBlock, Horizon') : Crafty.e('2D, WebGL, ColorEffects, coast, SunBlock, Horizon');
    e.colorDesaturation(Game.backgroundColor).saturationGradient(.9, .8).crop(1, 0, 255, 32).attr({
        z: -598,
        w: 256
    });
    return this.addBackground(0, this.level.visibleHeight - 225 - 16, e, .25);
});

generator.defineElement('cityDistance', function (mode) {
    var e;
    e = Crafty.e('2D, WebGL, ColorEffects, cityDistance, SunBlock, Horizon').colorDesaturation(Game.backgroundColor).saturationGradient(.9, .6).crop(1, 1, 255, 223).attr({
        z: -598,
        w: 256
    });
    return this.addBackground(0, this.level.visibleHeight - 225 - 16, e, .25);
});

generator.defineElement('city', function () {
    var bg, c, d, e;
    bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon, Flipable').attr({
        z: -505
    }).collision([4, 29, 72, 29, 72, 118, 4, 118]).colorDesaturation(Game.backgroundColor).saturationGradient(.6, .6);
    this.addBackground(0, this.level.visibleHeight - 350, bg, .375);
    e = Crafty.e('2D, WebGL, city, Collision, SunBlock, Horizon').colorDesaturation(Game.backgroundColor).saturationGradient(.4, .4).crop(0, 0, 511, 288).attr({
        z: -305,
        w: 513
    });
    e.collision([35, 155, 35, 10, 130, 10, 160, 155]);
    c = Crafty.e('2D, Collision, SunBlock');
    c.attr({
        w: e.w,
        h: e.h
    });
    c.collision([190, 155, 170, 80, 210, 10, 280, 10, 280, 155]);
    d = Crafty.e('2D, Collision, SunBlock');
    d.attr({
        w: e.w,
        h: e.h
    });
    d.collision([370, 155, 370, 40, 505, 40, 505, 155]);
    this.addBackground(0, this.level.visibleHeight - 310, e, .5);
    this.addBackground(0, this.level.visibleHeight - 310, c, .5);
    return this.addBackground(0, this.level.visibleHeight - 310, d, .5);
});

generator.defineElement('cityFrontTop', function () {
    var bb, floor, i, j;
    bb = Crafty.e('2D, WebGL, bigBuildingTop, ColorEffects, RiggedExplosion').attr({
        z: -20
    }).crop(1, 1, 446, 6 * 32);
    bb.colorOverride('#001fff', 'partial');
    this.add(0, this.level.visibleHeight - 1200, bb);
    for (i = j = 0; j < 3; i = ++j) {
        floor = Crafty.e('2D, WebGL, bigBuildingLayer, ColorEffects').attr({
            z: -20
        }).crop(1, 0, 446, 4 * 32);
        floor.attr({
            x: bb.x,
            y: bb.y + bb.h + (i * floor.h)
        });
        bb.attach(floor);
    }
    return bb.bind('BigExplosion', function () {
        var e, k, len, ref;
        if (this.buildingExploded) {
            return;
        }
        if (this.x + this.w > -Crafty.viewport.x && this.x < -Crafty.viewport.x + Crafty.viewport.width) {
            Crafty.e('2D, WebGL, glass, Tween').attr({
                x: this.x,
                y: this.y + 40,
                z: this.z + 5
            }).bind('TweenEnd', function () {
                return this.destroy();
            }).tween({
                y: this.y + 500
            }, 3000, 'easeInQuad');
            Crafty.e('2D, WebGL, glass, Tween').attr({
                x: this.x + 200,
                y: this.y + 60,
                z: this.z + 5
            }).bind('TweenEnd', function () {
                return this.destroy();
            }).tween({
                y: this.y + 500
            }, 3000, 'easeInQuad');
            Crafty.e('2D, WebGL, glass, Tween').attr({
                x: this.x,
                y: this.y + 180,
                z: this.z + 5
            }).bind('TweenEnd', function () {
                return this.destroy();
            }).tween({
                y: this.y + 500
            }, 3000, 'easeInQuad');
            Crafty.e('2D, WebGL, glass, Tween').attr({
                x: this.x + 180,
                y: this.y + 200,
                z: this.z + 5
            }).bind('TweenEnd', function () {
                return this.destroy();
            }).tween({
                y: this.y + 500
            }, 3000, 'easeInQuad');
            this.sprite(30, 13);
            ref = this._children;
            for (k = 0, len = ref.length; k < len; k++) {
                e = ref[k];
                if (e.has('bigBuildingLayer')) {
                    e.sprite(30, 19);
                }
            }
            return this.buildingExploded = true;
        }
    });
});

generator.defineElement('cityFront', function (height, offSet, bottomVariant) {
    var bb, bottom, calcHeight, floor, i, j, ref;
    if (height == null) {
        height = 6;
    }
    if (offSet == null) {
        offSet = 0;
    }
    if (bottomVariant == null) {
        bottomVariant = 'bigBuildingBottom';
    }
    bb = Crafty.e('2D, WebGL, bigBuildingTop, Collision, SunBlock, ColorEffects').attr({
        z: -20
    }).crop(1, 1, 446, 6 * 32);
    bb.colorOverride('#001fff', 'partial');
    calcHeight = (height + 2.5) * 128;
    bb.collision([32, 80, 160, 16, 416, 16, 416, calcHeight, 32, calcHeight]);
    this.add(offSet, this.level.visibleHeight - calcHeight - 16, bb);
    for (i = j = 0, ref = height; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        floor = Crafty.e('2D, WebGL, bigBuildingLayer, ColorEffects').attr({
            z: -20
        }).crop(1, 0, 446, 4 * 32);
        floor.attr({
            x: bb.x,
            y: bb.y + bb.h + (i * floor.h)
        });
        bb.attach(floor);
    }
    bottom = Crafty.e("2D, WebGL, " + bottomVariant + ", ColorEffects").attr({
        z: -20
    }).crop(1, 1, 446, 184);
    bottom.attr({
        x: bb.x,
        y: bb.y + bb.h + (height * 128)
    });
    return bb.attach(bottom);
});

generator.defineElement('cityFrontBlur', function () {
    return this.addBackground(200, this.level.visibleHeight - 1350, Crafty.e('2D, WebGL, bigBuildingTop').crop(1, 1, 446, 6 * 32).attr({
        w: 768,
        h: 288,
        z: 50,
        lightness: .4
    }), 1.5);
});

generator.defineElement('city-bridge', function () {
    var bg, e;
    bg = Crafty.e('2D, WebGL, cityLayer2, Collision, SunBlock, Horizon').collision([4, 29, 72, 29, 72, 118, 4, 118]).colorDesaturation(Game.backgroundColor).saturationGradient(.6, .6).attr({
        z: -505
    });
    this.addBackground(0, this.level.visibleHeight - 350, bg, .375);
    e = Crafty.e('2D, WebGL, cityBridge, Collision, Horizon').colorDesaturation(Game.backgroundColor).saturationGradient(.4, .4).crop(0, 0, 511, 160).attr({
        z: -305,
        w: 513
    });
    e.collision([35, 155, 35, 0, 130, 0, 130, 155]);
    return this.addBackground(0, this.level.visibleHeight - 182, e, .5);
});

generator.defineElement('cityStart', function () {
    var e;
    e = Crafty.e('2D, WebGL, cityStart, Collision, SunBlock, Horizon').attr({
        z: -305
    }).colorDesaturation(Game.backgroundColor).saturationGradient(.4, .4);
    e.collision([215, 155, 215, 60, 300, 60, 300, 10, 500, 10, 500, 155]);
    return this.addBackground(0, this.level.visibleHeight - 310, e, .5);
});

Game.CityScenery = (function (superClass) {
    extend(CityScenery, superClass);

    function CityScenery() {
        return CityScenery.__super__.constructor.apply(this, arguments);
    }

    CityScenery.prototype.assets = function () {
        return {
            sprites: {
                'city-scenery.png': {
                    tile: 32,
                    tileh: 32,
                    map: {
                        waterHorizon: [0, 17, 8, 5],
                        waterMiddle: [32, 0, 16, 6],
                        waterFront1: [0, 29, 16, 3],
                        waterFront2: [16, 29, 16, 3],
                        coastStart: [8, 18, 8, 1],
                        coast: [8, 17, 8, 1],
                        cityBridge: [0, 24, 16, 5],
                        cityStart: [0, 0, 16, 9],
                        city: [16, 0, 16, 9],
                        cityLayer2: [0, 9, 12, 8],
                        cityDistance: [32, 6, 8, 7],
                        cityDistanceBaseBottom: [32, 9, 8, 4],
                        cityDistanceBaseTop: [40, 6, 8, 7],
                        bigBuildingTop: [16, 13, 16, 6],
                        bigBuildingBrokenTop: [30, 13, 16, 6],
                        bigBuildingLayer: [16, 19, 16, 4],
                        bigBuildingBottom: [16, 23, 16, 6],
                        bigBuildingBottom2: [30, 23, 16, 6],
                        glass: [12, 9, 4, 3],
                        cloud: [16, 9, 8, 3],
                        shadow: [16, 12, 2, 1],
                        bridgeDeck: [0, 32, 16, 6],
                        damagedBridgeDeck: [0, 48, 16, 6],
                        bridgePillar: [32, 29, 6, 17],
                        bridgePillarBroken: [38, 29, 6, 17],
                        bigGlare: [0, 38, 7, 7],
                        sun: [13, 38, 2, 2],
                        directGlare: [7, 38, 6, 6]
                    }
                }
            }
        };
    };

    return CityScenery;

})(Game.LevelScenery);

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Intro';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'Ocean';

    _Class.prototype.generate = function () {
        var barrelLocator, cabinHeight, frontWave, height, shipHeight, shipLength;
        _Class.__super__.generate.apply(this, arguments);
        shipLength = 700;
        this.addElement('waterFront');
        height = 45;
        shipHeight = 155;
        cabinHeight = 150;
        this.add(0, this.level.visibleHeight - height - shipHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr({
            z: -23,
            w: shipLength,
            h: shipHeight
        }));
        this.add(50, this.level.visibleHeight - height - shipHeight - cabinHeight, Crafty.e('2D, WebGL, Color').color('#202020').attr({
            z: -23,
            w: 350,
            h: cabinHeight
        }));
        this.elevator = Crafty.e('2D, WebGL, Color, Tween').color('#707070').attr({
            z: -22,
            w: 160,
            h: 5
        });
        this.add(110, this.level.visibleHeight - 70, this.elevator);
        this.outside = Crafty.e('2D, WebGL, Color, Tween').color('#303030').attr({
            z: -21,
            w: shipLength + 10,
            h: shipHeight - 5,
            alpha: 0
        });
        this.add(0, this.level.visibleHeight - this.outside.h - height, this.outside);
        barrelLocator = Crafty.e('2D, BarrelLocation');
        this.add(500, this.level.visibleHeight - this.outside.h - height, barrelLocator);
        this.addElement('water');
        this.addElement('waterHorizon');
        frontWave = Crafty.e('2D, WebGL, waterFront1, WaveFront').attr({
            z: 3,
            w: (this.delta.x + Crafty.viewport.width * .5) + 1,
            h: 200,
            lightness: 0.5
        }).crop(0, 1, 512, 95);
        this.addBackground(0, this.level.visibleHeight - 18, frontWave, 1.25);
        frontWave.originalY = frontWave.y;
        return this.addElement('cloud');
    };

    _Class.prototype.enter = function () {
        var block, c, fixOtherShips, leadAnimated;
        _Class.__super__.enter.apply(this, arguments);
        this.speed = this.level._forcedSpeed;
        Crafty('ScrollWall').attr({
            y: 120
        });
        this.level.setForcedSpeed(0);
        c = [
          {
              type: 'linear',
              x: -160,
              easingFn: 'easeInQuad',
              duration: 1200
          }, {
              type: 'linear',
              y: -130,
              duration: 1200,
              easingFn: 'easeInOutQuad',
              event: 'lift'
          }, {
              type: 'delay',
              duration: 500,
              event: 'shipExterior'
          }, {
              type: 'linear',
              x: 70,
              y: -10,
              easingFn: 'easeInQuad',
              duration: 1200
          }, {
              type: 'delay',
              duration: 1,
              event: 'unlock'
          }, {
              type: 'delay',
              duration: 1,
              event: 'go'
          }
        ];
        block = this;
        leadAnimated = null;
        fixOtherShips = function (newShip) {
            if (!leadAnimated) {
                return;
            }
            if (!leadAnimated.has('Choreography')) {
                return;
            }
            newShip.attr({
                x: leadAnimated.x - newShip.w - 10,
                y: leadAnimated.y
            });
            if (leadAnimated.disableControls) {
                newShip.disableControl();
            }
            newShip.addComponent('Choreography');
            newShip.synchChoreography(leadAnimated);
            newShip.one('ChoreographyEnd', function () {
                return this.removeComponent('Choreography', false);
            });
            newShip.one('unlock', function () {
                this.enableControl();
                return this.weaponsEnabled = true;
            });
            return newShip.weaponsEnabled = leadAnimated.weaponsEnabled;
        };
        this.bind('ShipSpawned', fixOtherShips);
        return Crafty('PlayerControlledShip').each(function (index) {
            if (index !== 0) {
                return fixOtherShips(this);
            }
            leadAnimated = this;
            this.addComponent('Choreography');
            this.attr({
                x: 360 - (50 * index),
                y: Crafty.viewport.height - 70 - this.h
            });
            this.disableControl();
            this.weaponsEnabled = false;
            this.choreography(c);
            this.one('ChoreographyEnd', (function (_this) {
                return function () {
                    _this.removeComponent('Choreography', 'no');
                    return block.unbind('ShipSpawned');
                };
            })(this));
            this.one('unlock', function () {
                this.enableControl();
                return this.weaponsEnabled = true;
            });
            this.one('lift', function () {
                block.elevator.tween({
                    y: block.elevator.y - 130
                }, 1200, 'easeInOutQuad');
                return Crafty('ScrollWall').each(function () {
                    this.addComponent('Tween');
                    this.tween({
                        y: 0
                    }, 2500);
                    return this.one('TweenEnd', function () {
                        return this.removeComponent('Tween', false);
                    });
                });
            });
            this.one('shipExterior', function () {
                return block.outside.tween({
                    alpha: 1
                }, 700).addComponent('Solid');
            });
            return this.one('go', function () {
                return block.level.setForcedSpeed(block.speed, {
                    accelerate: false
                });
            });
        });
    };

    return _Class;

})(Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Ocean';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cloud');
        this.addElement('cloud');
        this.addElement('waterHorizon');
        this.addElement('water');
        return this.addElement('waterFront');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.CoastStart';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'Coast';

    _Class.prototype.autoPrevious = 'Ocean';

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cloud');
        this.addElement('cityHorizon', 'start');
        this.addElement('water');
        return this.addElement('waterFront');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Coast';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('waterFront');
        this.addElement('cityHorizon');
        this.addElement('water');
        return this.addElement('cloud');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.BayStart';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'Bay';

    _Class.prototype.autoPrevious = 'Coast';

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cloud');
        this.addElement('cityHorizon');
        this.addElement('water');
        this.addElement('waterFront');
        return this.addElement('cityStart');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Bay';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cloud');
        this.addElement('waterFront');
        this.addElement('water');
        this.addElement('cityHorizon');
        return this.addElement('city');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.BayFull';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cloud');
        this.addElement('waterFront');
        this.addElement('water');
        this.addElement('cityDistance');
        return this.addElement('city');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.UnderBridge';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'BayFull';

    _Class.prototype.generate = function () {
        var bridgeWidth, d1, dh, height, p1, p2;
        _Class.__super__.generate.apply(this, arguments);
        this.notifyOffsetX = -100;
        this.addElement('waterFront', {
            lightness: 0.8
        });
        this.addElement('water');
        this.addElement('cityDistance');
        this.addElement('city-bridge');
        bridgeWidth = Crafty.viewport.width;
        height = Crafty.viewport.height * 1.1;
        this.addBackground(0, 335, this.deck(.55, false, {
            w: 550,
            z: -280
        }), .55);
        this.addBackground(0, 295, this.deck(.45, true, {
            w: 600,
            z: -270
        }), .60);
        this.addBackground(0, 255, this.deck(.35, false, {
            w: 650,
            z: -260
        }), .65);
        this.addBackground(40, 290, this.pillar(.35, {
            h: 200,
            z: -261
        }), .65);
        this.addBackground(870, 290, this.pillarX(.35, {
            h: 200,
            z: -261
        }), .65);
        this.addBackground(0, 205, this.deck(.25, true, {
            w: 700,
            z: -50
        }), .70);
        this.addBackground(0, 155, this.deck(.15, false, {
            w: 750,
            z: -40
        }), .75);
        this.addBackground(10, 180, this.pillar(0, {
            h: 350,
            z: -31
        }), .8);
        this.addBackground(830, 180, this.pillarX(0, {
            h: 350,
            z: -31
        }), .8);
        this.addBackground(0, 95, this.deck(.05, true, {
            w: 800,
            z: -30
        }), .8);
        this.addBackground(0, 20, this.deck(0, false, {
            w: 900,
            z: -20
        }).addComponent('BackDeck'), .9);
        dh = Crafty.e('2D, Solid, Collision, BridgeCeiling').attr({
            w: 1000,
            h: 30
        }).origin('middle right');
        this.addBackground(0, -60, dh, 1.0);
        d1 = this.deck(0, true, {
            w: 1000,
            z: -10
        }).addComponent('MainDeck');
        this.addBackground(0, -60, d1, 1.0);
        this.addBackground(0, -180, this.deck(0, false, {
            w: 1200,
            z: 100,
            lightness: 0.6,
            blur: 0.0
        }).addComponent('FrontDeck'), 1.2);
        p1 = this.pillar(0, {
            h: 750,
            z: 80,
            lightness: 0.6,
            blur: 0.0
        }).addComponent('TiltPillarLeft');
        p2 = this.pillarX(0, {
            h: 750,
            z: 80,
            lightness: 0.6,
            blur: 0.0
        }).addComponent('TiltPillarRight');
        this.addBackground(-20, -60, p1, 1.2);
        this.addBackground(834, -60, p2, 1.2);
        return this.bind('BridgeCollapse', {
            once: true
        }, (function (_this) {
            return function (level) {
                var d0, d2;
                d0 = Crafty('FrontDeck').get(0).addComponent('TweenPromise').sprite(16, 32);
                d1 = Crafty('MainDeck').get(0).addComponent('TweenPromise').sprite(16, 32);
                d2 = Crafty('BackDeck').get(0).addComponent('TweenPromise').sprite(16, 32);
                d0.half.sprite(16, 32);
                d1.half.sprite(16, 32);
                d2.half.sprite(16, 32);
                p1 = Crafty('TiltPillarLeft').get(0).addComponent('TweenPromise').sprite(38, 29);
                p2 = Crafty('TiltPillarRight').get(0).addComponent('TweenPromise').sprite(38, 29);
                dh = Crafty('BridgeCeiling').get(0).addComponent('TweenPromise');
                level.setForcedSpeed(200, {
                    accelerate: true
                });
                return WhenJS.sequence([
                  function () {
                      return WhenJS.parallel([
                        function () {
                            return d0.tweenPromise({
                                rotation: -12,
                                dy: d0.dy + 100
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return d1.tweenPromise({
                                rotation: -10,
                                dy: d1.dy + 100
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return dh.tweenPromise({
                                rotation: -10,
                                dy: dh.dy + 100
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return d2.tweenPromise({
                                rotation: -7,
                                dy: d2.dy + 100
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return p1.tweenPromise({
                                rotation: -7,
                                dy: p1.dy + 100
                            }, 3000, 'easeInQuad');
                        }, function () {
                            return p2.tweenPromise({
                                rotation: 7
                            }, 3000, 'easeInQuad');
                        }
                      ]);
                  }, function () {
                      return WhenJS.parallel([
                        function () {
                            return d0.tweenPromise({
                                dy: d0.dy + 400
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return d1.tweenPromise({
                                dy: d1.dy + 430
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return dh.tweenPromise({
                                dy: dh.dy + 430
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return d2.tweenPromise({
                                dy: d2.dy + 400
                            }, 4000, 'easeInQuad');
                        }, function () {
                            return p1.tweenPromise({
                                rotation: -27,
                                dy: p1.dy + 300
                            }, 3000, 'easeInQuad');
                        }, function () {
                            return p2.tweenPromise({
                                rotation: 27,
                                dy: p2.dy + 200
                            }, 3000, 'easeInQuad');
                        }
                      ]);
                  }
                ]);
            };
        })(this));
    };

    _Class.prototype.deck = function (gradient, flipped, attr) {
        var aspectR, color, part2, result;
        aspectR = 1024 / 180;
        attr.h = attr.w / aspectR;
        color = flipped ? '#2ba04c' : '#b15a5a';
        result = Crafty.e('2D, WebGL, bridgeDeck, ColorEffects, Horizon, SunBlock, SpriteAnimation').crop(0, 2, 511, 180).attr(_.extend(attr, {
            w: attr.w / 2
        })).saturationGradient(gradient, gradient).colorOverride(color, 'partial');
        part2 = Crafty.e('2D, WebGL, bridgeDeck, ColorEffects, Horizon, SunBlock, SpriteAnimation').crop(0, 2, 511, 180).saturationGradient(gradient, gradient).flip('X').colorOverride(color, 'partial');
        part2.attr(_.extend(attr, {
            x: result.x + result.w,
            y: result.y,
            z: result.z,
            w: result.w,
            h: result.h
        }));
        result.half = part2;
        result.attach(part2);
        result.origin(result.h / 2, result.w * 2);
        return result;
    };

    _Class.prototype.pillar = function (gradient, attr) {
        var aspectR;
        aspectR = 180 / 534;
        attr.w = attr.h * aspectR;
        attr.h = attr.h;
        return Crafty.e('2D, WebGL, bridgePillar, ColorEffects, Horizon, SunBlock').crop(2, 0, 180, 534).attr(attr).saturationGradient(gradient, gradient);
    };

    _Class.prototype.pillarX = function (gradient, attr) {
        return this.pillar(gradient, attr).flip('X');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Skyline';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cityFrontTop');
        this.addElement('cityFrontBlur');
        this.addElement('water');
        this.addElement('cityDistance');
        return this.addElement('city');
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.SkylineBase';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'Skyline2';

    _Class.prototype.generate = function () {
        var e, eb, h;
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cityFront');
        h = 400 + 200;
        e = Crafty.e('2D, WebGL, ColorEffects, cityDistanceBaseTop, SunBlock, Horizon').colorDesaturation(Game.backgroundColor).saturationGradient(.9, .6).crop(1, 1, 255, 223).attr({
            z: -598,
            w: 256
        });
        this.addBackground(0, this.level.visibleHeight - 225 - 16 - 127, e, .25);
        eb = Crafty.e('2D, WebGL, ColorEffects, cityDistanceBaseBottom, MiliBase, SunBlock, Horizon').colorDesaturation(Game.backgroundColor).saturationGradient(.9, .6).crop(1, 1, 255, 127).attr({
            z: -598,
            w: 256
        });
        this.addBackground(0, this.level.visibleHeight - 225 - 16 + 96, eb, .25);
        this.addElement('city');
        h = 400 + 300;
        return this.add(0, this.level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h,
            z: -10
        }).color('#505050'));
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Skyline2';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        var h, h2, h3;
        _Class.__super__.generate.apply(this, arguments);
        this.addElement('cityFront');
        this.addElement('cityFront', 4, 512, 'bigBuildingBottom2');
        this.addElement('water');
        this.addElement('cityDistance');
        this.addElement('city');
        h = 160;
        this.add(0, this.level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h,
            z: -25
        }).color('#555'));
        h2 = 10;
        this.add(0, this.level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h2,
            z: -25
        }).color('#777'));
        h3 = 400;
        this.add(0, this.level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h3,
            z: -25
        }).color('#333'));
        h3 = 40;
        return this.add(0, this.level.visibleHeight + 170 - h3, Crafty.e('2D, Solid').attr({
            w: this.delta.x,
            h: h3,
            z: 2
        }));
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.TrainTunnel';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        var h, h2;
        _Class.__super__.generate.apply(this, arguments);
        h = 150;
        this.add(0, this.level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock, Solid').attr({
            w: this.delta.x,
            h: h,
            z: -10
        }).color('#505050'));
        h2 = 400;
        this.add(0, this.level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h2,
            z: -10
        }).color('#202020'));
        h = 150;
        return this.add(0, this.level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, Solid, SunBlock').attr({
            w: this.delta.x,
            h: h + h2,
            z: -10
        }).color('#505050'));
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.SmallerTrainTunnel';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.generate = function () {
        var h, h2, h3;
        _Class.__super__.generate.apply(this, arguments);
        h = 250;
        this.add(0, this.level.visibleHeight - 100, Crafty.e('2D, WebGL, Color, SunBlock, Solid').attr({
            w: this.delta.x,
            h: h,
            z: -10
        }).color('#505050'));
        h2 = 300;
        this.add(0, this.level.visibleHeight - 100 + h, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: h2,
            z: -10
        }).color('#202020'));
        h3 = 350;
        return this.add(0, this.level.visibleHeight - 100 + h + h2, Crafty.e('2D, WebGL, Color, Solid, SunBlock').attr({
            w: this.delta.x,
            h: h3,
            z: -10
        }).color('#505050'));
    };

    return _Class;

})(this.Game.LevelScenery));

// ---
// generated by coffee-script 1.9.2