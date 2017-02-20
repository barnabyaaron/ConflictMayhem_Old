define([
    'underscore',
    'crafty',
    'app'
], function(_, Crafty, Game) {
    return (function(superClass) {
        extend(EntityScript, superClass);

        function EntityScript() {
            return EntityScript.__super__.constructor.apply(this, arguments);
        }

        EntityScript.prototype.initialize = function () {
            var args, identifier, ref;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            this.boundEvents = [];
            if (_.isEmpty(args)) {
                args.push({});
            }
            this.entity = this.spawn.apply(this, args);
            if (_.isObject(args[0]) && (args[0].identifier != null)) {
                identifier = args[0].identifier;
                this.entity.addComponent(identifier);
            }
            this.synchronizer = (ref = this.options.synchronizer) != null ? ref : new Game.Synchronizer;
            this.synchronizer.registerEntity(this);
            if (this.entity == null) {
                this.synchronizer.unregisterEntity(this);
                return WhenJS({
                    alive: false,
                    killedAt: new Date,
                    location: null
                });
            }
            if (!this.entity.has('PlayerControlledShip')) {
                this.entity.attr({
                    x: this.entity.x - Crafty.viewport.x,
                    y: this.entity.y - Crafty.viewport.y
                });
            }
            this.entity.bind('Destroyed', (function (_this) {
                return function () {
                    _this.currentSequence = null;
                    _this.synchronizer.unregisterEntity(_this);
                    _this.enemy.location.x = _this.entity.x + Crafty.viewport.x;
                    _this.enemy.location.y = _this.entity.y + Crafty.viewport.y;
                    _this.enemy.alive = false;
                    return _this.enemy.killedAt = new Date;
                };
            })(this));
            this.enemy = {
                moveState: 'air',
                alive: true,
                location: {}
            };
            return EntityScript.__super__.initialize.apply(this, arguments)["catch"]((function (_this) {
                return function (e) {
                    if (e.message !== 'sequence mismatch') {
                        throw e;
                    }
                    if (_this.enemy.alive) {
                        return _this.alternatePath;
                    }
                };
            })(this))["finally"]((function (_this) {
                return function () {
                    if (_this.enemy.alive && !_this.entity.has('KeepAlive')) {
                        return _this.entity.destroy();
                    }
                };
            })(this)).then((function (_this) {
                return function () {
                    return _this.enemy;
                };
            })(this));
        };

        EntityScript.prototype.spawn = function () { };

        return EntityScript;

    })(Game.LazerScript);
})