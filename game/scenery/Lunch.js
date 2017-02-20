var generator,
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

generator = this.Game.levelGenerator;

generator.defineElement('blockcloud', function () {
    var blur, c1, c2, h, s, v, w, y;
    v = Math.random();
    blur = Math.random() * 4.0;
    if (v > .2) {
        y = (Math.random() * 20) + 100;
        w = (Math.random() * 20) + 125;
        h = (Math.random() * 10) + 50;
        c1 = Crafty.e('2D, WebGL, Color').attr({
            z: -300,
            w: w,
            h: h,
            alpha: (Math.random() * 0.8) + 0.2
        }).color('#FFFFFF');
        if (Math.random() < 0.7) {
            c1 = c1.flip('X');
        }
        this.addBackground(20 + (Math.random() * 400), y, c1, .5);
    }
    if (v < .6) {
        s = (Math.random() * .20) + .25;
        y = 280 - (s * 150);
        w = ((Math.random() * 10) + 70) - (s * 20);
        h = ((Math.random() * 5) + 20) - (s * 10);
        c2 = Crafty.e('2D, WebGL, Color').attr({
            z: -570,
            w: w,
            h: h,
            alpha: (Math.random() * 0.8) + 0.2
        }).color('#FFFFFF');
        if (Math.random() < 0.2) {
            c2 = c2.flip('X');
        }
        return this.addBackground(30 + Math.random() * 400, y, c2, s);
    }
});

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Blackness';

    _Class.prototype.delta = {
        x: 600,
        y: 0
    };

    _Class.prototype.generate = function () {
        return _Class.__super__.generate.apply(this, arguments);
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.OceanOld';

    _Class.prototype.delta = {
        x: 800,
        y: 0
    };

    _Class.prototype.generate = function () {
        var goldenStripe, height;
        _Class.__super__.generate.apply(this, arguments);
        height = 65;
        this.add(0, this.level.visibleHeight - 45, Crafty.e('2D, Solid').attr({
            w: this.delta.x,
            h: 45
        }));
        this.add(0, this.level.visibleHeight - height, Crafty.e('2D, WebGL, Color, SunBlock').attr({
            w: this.delta.x,
            h: height,
            z: -300
        }).color('#6262d2'));
        this.addBackground(0, this.level.visibleHeight - 225, Crafty.e('2D, WebGL, Color, SunBlock').color('#33337e').attr({
            z: -600,
            w: (this.delta.x * .25) + 1,
            h: 200
        }), .25);
        goldenStripe = Crafty.e('2D, WebGL, Gradient, GoldenStripe').topColor('#DDDD00').bottomColor('#DDDD00', Game.webGLMode ? 0 : 1).attr({
            z: -599,
            w: this.delta.x * .25,
            h: 1,
            alpha: 0
        });
        this.addBackground(0, this.level.visibleHeight - 225, goldenStripe, .25);
        this.addElement('blockcloud');
        this.addBackground(0, this.level.visibleHeight - 150, Crafty.e('2D, WebGL, Color, SunBlock').color('#3030B0').attr({
            z: -500,
            w: (this.delta.x * .5) + 1,
            h: 105
        }), .5);
        return this.addBackground(0, this.level.visibleHeight - 90, Crafty.e('2D, WebGL, Color, SunBlock').color('#3030B0').attr({
            z: -301,
            w: (this.delta.x * .5) + 1,
            h: 70
        }), .5);
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.OceanToNew';

    _Class.prototype.delta = {
        x: 1024,
        y: 0
    };

    _Class.prototype.autoNext = 'Ocean';

    _Class.prototype.generate = function () {
        var goldenStripe, height, water1, water2, wfg, wg, wh, whg, ws;
        _Class.__super__.generate.apply(this, arguments);
        wh = Crafty.e('2D, WebGL, waterHorizon, SunBlock, Horizon').attr({
            z: -601
        }).colorDesaturation(Game.backgroundColor).saturationGradient(1.0, .5);
        if (Game.webGLMode === false) {
            wh.attr({
                lightness: .6
            });
        }
        this.addBackground(0, this.level.visibleHeight - 225, wh, .25);
        whg = Crafty.e('2D, WebGL, Gradient, SunBlock').topColor('#33337e').bottomColor('#33337e', 0).attr({
            z: -600,
            rotation: -90,
            h: (this.delta.x * .25) + 1,
            w: 200
        });
        this.addBackground(0, this.level.visibleHeight - 25, whg, .25);
        goldenStripe = Crafty.e('2D, WebGL, Gradient, GoldenStripe').topColor('#DDDD00').bottomColor('#DDDD00', Game.webGLMode ? 0 : 1).attr({
            z: -599,
            w: this.delta.x * .25,
            h: 1,
            alpha: 0
        });
        this.addBackground(0, this.level.visibleHeight - 225, goldenStripe, .25);
        ws = Crafty.e('2D, WebGL, waterMiddle, SunBlock, Horizon').crop(1, 0, 511, 192).saturationGradient(.7, .0).attr({
            z: -501,
            w: 513
        });
        if (Game.webGLMode === false) {
            ws.attr({
                lightness: .8
            });
        }
        this.addBackground(0, this.level.visibleHeight - 150, ws, .5);
        wg = Crafty.e('2D, WebGL, Gradient, SunBlock').topColor('#3030B0').bottomColor('#3030B0', 0).attr({
            z: -500,
            rotation: -90,
            h: (this.delta.x * .5) + 1,
            w: 200
        });
        this.addBackground(0, this.level.visibleHeight + 50, wg, .5);
        height = 65;
        this.add(0, this.level.visibleHeight - 45, Crafty.e('2D, Solid').attr({
            w: this.delta.x,
            h: 45
        }));
        water1 = Crafty.e('2D, WebGL, waterFront1, Wave1, SunBlock').attr({
            z: -300
        });
        this.add(0, this.level.visibleHeight - height, water1);
        water1.originalY = water1.y;
        water2 = Crafty.e('2D, WebGL, waterFront2, Wave2, SunBlock').attr({
            z: -300
        });
        this.add(512, this.level.visibleHeight - height, water2);
        water2.originalX = water2.x;
        water2.originalY = water2.y;
        wfg = Crafty.e('2D, WebGL, Gradient, SunBlock').topColor('#6262d2').bottomColor('#6262d2', 0).attr({
            z: -299,
            rotation: -90,
            h: this.delta.x,
            w: 200
        });
        return this.add(0, this.level.visibleHeight - height + 200, wfg);
    };

    return _Class;

})(Game.CityScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.OpenSpace';

    _Class.prototype.delta = {
        x: 700,
        y: 0
    };

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.add(0, 150, Crafty.e('2D, WebGL, Solid, Color').color('#505045').attr({
            w: 42,
            h: 70
        }));
        this.add(500, 50, Crafty.e('2D, WebGL, Solid, Color').color('#404045').attr({
            w: 82,
            h: 70
        }));
        this.add(200, 250, Crafty.e('2D, WebGL, Solid, Color').color('#505045').attr({
            w: 52,
            h: 80
        }));
        this.add(100, 450, Crafty.e('2D, WebGL, Solid, Color').color('#505045').attr({
            w: 52,
            h: 40
        }));
        return this.add(400, 550, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 82,
            h: 30
        }));
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.TunnelStart';

    _Class.prototype.delta = {
        x: 1000,
        y: 0
    };

    _Class.prototype.autoNext = 'Tunnel';

    _Class.prototype.generate = function () {
        _Class.__super__.generate.apply(this, arguments);
        this.addBackground(380, this.level.visibleHeight - 180, Crafty.e('2D, WebGL, Color').color('#505050').attr({
            z: -110,
            w: 40,
            h: 180
        }), .5);
        this.addBackground(380, this.level.visibleHeight - 90, Crafty.e('2D, WebGL, Color').color('#606060').attr({
            z: -200,
            w: 40,
            h: 90
        }), .25);
        this.addBackground(380, this.level.visibleHeight - 360, Crafty.e('2D, WebGL, Color').color('#303030').attr({
            z: 22,
            w: 40,
            h: 360
        }), 1.5);
        this.add(0, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 350,
            h: 55
        }));
        this.add(350, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 100,
            h: 110
        }));
        this.add(450, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 550,
            h: 65
        }));
        return this.add(380, -40, Crafty.e('2D, WebGL, Color').color('#202020').attr({
            z: -10,
            w: this.delta.x - 380,
            h: this.level.visibleHeight + 40
        }));
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.TunnelEnd';

    _Class.prototype.delta = {
        x: 1000,
        y: 0
    };

    _Class.prototype.autoNext = 'OceanOld';

    _Class.prototype.generate = function () {
        var h;
        _Class.__super__.generate.apply(this, arguments);
        this.addBackground(380, this.level.visibleHeight - 360, Crafty.e('2D, WebGL, Color').color('#303030').attr({
            z: 22,
            w: 40,
            h: 360
        }), 1.5);
        this.addBackground(380, this.level.visibleHeight - 180, Crafty.e('2D, WebGL, Color').color('#505050').attr({
            z: -110,
            w: 40,
            h: 180
        }), .5);
        this.addBackground(380, this.level.visibleHeight - 90, Crafty.e('2D, WebGL, Color').color('#606060').attr({
            z: -800,
            w: 40,
            h: 90
        }), .25);
        h = 15;
        this.add(0, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 350,
            h: h
        }));
        h = 70;
        this.add(350, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 100,
            h: h
        }));
        h = 25;
        this.add(450, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 550,
            h: h
        }));
        return this.add(0, -40, Crafty.e('2D, WebGL, Color').color('#202020').attr({
            z: -10,
            w: 380,
            h: this.level.visibleHeight + 40
        }));
    };

    return _Class;

})(this.Game.LevelScenery));

generator.defineBlock((function (superClass) {
    extend(_Class, superClass);

    function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = 'City.Tunnel';

    _Class.prototype.delta = {
        x: 1000,
        y: 0
    };

    _Class.prototype.generate = function () {
        var h;
        _Class.__super__.generate.apply(this, arguments);
        this.add(0, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 350,
            h: 55
        }));
        this.add(350, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 100,
            h: 110
        }));
        this.add(450, -40, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 550,
            h: 65
        }));
        h = 15;
        this.add(0, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 350,
            h: h
        }));
        h = 70;
        this.add(350, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 100,
            h: h
        }));
        h = 25;
        this.add(450, this.level.visibleHeight - h, Crafty.e('2D, WebGL, Solid, Color').color('#404040').attr({
            w: 550,
            h: h
        }));
        return this.add(0, -40, Crafty.e('2D, WebGL, Color').color('#202020').attr({
            z: -1,
            w: this.delta.x,
            h: this.level.visibleHeight + 40
        }));
    };

    return _Class;

})(this.Game.LevelScenery));

// ---
// generated by coffee-script 1.9.2