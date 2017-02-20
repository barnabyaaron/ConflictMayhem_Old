var Game,
  slice = [].slice;

Game = this.Game;

Game.LevelScenery = (function () {
    LevelScenery.prototype.screenHeight = 480;

    function LevelScenery(level, generator, settings) {
        this.level = level;
        this.generator = generator;
        this.settings = settings;
        this.createdElements = [];
        this.createdBindings = [];
    }

    LevelScenery.prototype.loadAssets = function () {
        var d, obj;
        obj = typeof this.assets === "function" ? this.assets() : void 0;
        if (obj == null) {
            return WhenJS();
        }
        d = WhenJS.defer();
        Crafty.load(obj, ((function (_this) {
            return function () {
                return d.resolve();
            };
        })(this)));
        return d.promise;
    };

    LevelScenery.prototype.build = function (pos) {
        if (this.generated) {
            return;
        }
        if (this.x == null) {
            this.x = pos.x;
        }
        if (this.y == null) {
            this.y = pos.y;
        }
        this.generated = true;
        this.generate();
        return this._notifyEnterFunction(this.notifyOffsetX);
    };

    LevelScenery.prototype._notifyEnterFunction = function (offsetX) {
        var block;
        if (offsetX == null) {
            offsetX = 0;
        }
        block = this;
        return Crafty.e('2D, Collision').attr({
            x: this.x + offsetX,
            y: this.y,
            w: 10,
            h: 800
        }).onHit('ScrollFront', function () {
            if (!this.triggeredFront) {
                Crafty.trigger('EnterBlock', block);
                return this.triggeredFront = true;
            }
        }).onHit('PlayerControlledShip', function () {
            if (!this.triggeredPlayerFront) {
                Crafty.trigger('PlayerEnterBlock', block);
                return this.triggeredPlayerFront = true;
            }
        }).onHit('ScrollWall', function () {
            Crafty.trigger('LeaveBlock', block);
            return this.destroy();
        });
    };

    LevelScenery.prototype.generate = function () {
        var ref;
        return (ref = this.settings.generate) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.enter = function () {
        var ref;
        return (ref = this.settings.enter) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.playerEnter = function () {
        var ref;
        return (ref = this.settings.playerEnter) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.playerLeave = function () {
        var ref;
        return (ref = this.settings.playerLeave) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.inScreen = function () {
        var ref;
        return (ref = this.settings.inScreen) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.outScreen = function () {
        var ref;
        return (ref = this.settings.outScreen) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.leave = function () {
        var ref;
        return (ref = this.settings.leave) != null ? ref.apply(this) : void 0;
    };

    LevelScenery.prototype.clean = function () {
        var b, e, i, j, len, len1, ref, ref1;
        ref = this.createdElements;
        for (i = 0, len = ref.length; i < len; i++) {
            e = ref[i];
            e.destroy();
        }
        this.createdElements = [];
        ref1 = this.createdBindings;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
            b = ref1[j];
            Crafty.unbind(b.event, b.callback);
        }
        return this.createdBindings = [];
    };

    LevelScenery.prototype.add = function (x, y, element) {
        element.attr({
            x: this.x + x,
            y: this.y + y
        });
        return this.createdElements.push(element);
    };

    LevelScenery.prototype.addBackground = function (x, y, element, speed) {
        element.addComponent('ViewportRelativeMotion').viewportRelativeMotion({
            x: this.x + x,
            y: this.y + y,
            speed: speed
        });
        return this.createdElements.push(element);
    };

    LevelScenery.prototype.addElement = function () {
        var args, name;
        name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return this.generator.elements[name].apply(this, args);
    };

    LevelScenery.prototype.bind = function (event, options, callback) {
        if (_.isFunction(options) && callback === void 0) {
            callback = options;
            options = {};
        }
        this.createdBindings.push({
            event: event,
            callback: callback
        });
        if (options.once === true) {
            return Crafty.one(event, callback);
        } else {
            return Crafty.bind(event, callback);
        }
    };

    LevelScenery.prototype.unbind = function (event) {
        var b, i, len, ref, unbound;
        unbound = [];
        ref = this.createdBindings;
        for (i = 0, len = ref.length; i < len; i++) {
            b = ref[i];
            if (!(b.event === event)) {
                continue;
            }
            unbound.push(b);
            Crafty.unbind(b.event, b.callback);
        }
        return this.createdBindings = _.without.apply(_, [this.createdBindings].concat(slice.call(unbound)));
    };

    LevelScenery.prototype.canCleanup = function () {
        var cameraX, elem, i, len, ref;
        cameraX = Crafty.viewport._x * -1;
        if ((this.x + this.delta.x) > cameraX) {
            return false;
        }
        ref = this.createdElements;
        for (i = 0, len = ref.length; i < len; i++) {
            elem = ref[i];
            if (elem.x + elem.w >= cameraX) {
                return false;
            }
        }
        return true;
    };

    return LevelScenery;

})();