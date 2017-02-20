var Game,
  slice = [].slice;

Game = this.Game;

if (Game.ScriptModule == null) {
    Game.ScriptModule = {};
}

Game.ScriptModule.Core = {
    _verify: function (sequence) {
        if (sequence !== this.currentSequence) {
            throw new Error('sequence mismatch');
        }
        return this.level.verify();
    },
    _skippingToCheckpoint: function () {
        return (this.startAtCheckpoint != null) && this.currentCheckpoint < this.startAtCheckpoint;
    },
    sequence: function () {
        var tasks;
        tasks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return WhenJS.sequence(tasks, sequence);
            };
        })(this);
    },
    parallel: function () {
        var tasks;
        tasks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                return WhenJS.parallel(tasks, sequence);
            };
        })(this);
    },
    "if": function (condition, block, elseBlock) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (condition.apply(_this)) {
                    return block(sequence);
                } else {
                    return typeof elseBlock === "function" ? elseBlock(sequence) : void 0;
                }
            };
        })(this);
    },
    "while": function (condition, block) {
        return (function (_this) {
            return function (sequence) {
                var whileResolved;
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                if (block === void 0) {
                    block = condition;
                    condition = function () {
                        var d;
                        d = WhenJS.defer();
                        return d.promise;
                    };
                }
                whileResolved = false;
                condition(sequence)["catch"](function (e) {
                    if (e.message !== 'sequence mismatch') {
                        throw e;
                    }
                })["finally"](function () {
                    return whileResolved = true;
                });
                return WhenJS.iterate(function () {
                    return 1;
                }, function () {
                    return whileResolved;
                }, function () {
                    return block(sequence);
                }, 1);
            };
        })(this);
    },
    repeat: function (times, block) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                if (block === void 0) {
                    return _this["while"](times)(sequence);
                }
                if (times === 0) {
                    return;
                }
                return WhenJS(block(sequence)).then(function () {
                    return _this.repeat(times - 1, block)(sequence);
                });
            };
        })(this);
    },
    runScript: function () {
        var args, scriptClass;
        scriptClass = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return (function (_this) {
            return function (sequence) {
                var ref;
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                return (ref = new scriptClass(_this.level)).run.apply(ref, args);
            };
        })(this);
    },
    async: function (task) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                task(sequence);
            };
        })(this);
    },
    wait: function (amount) {
        return (function (_this) {
            return function (sequence) {
                var d, duration, parts, ref;
                _this._verify(sequence);
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                d = WhenJS.defer();
                duration = Math.max((ref = typeof amount === "function" ? amount() : void 0) != null ? ref : amount, 0);
                parts = Math.floor(duration / 40);
                Crafty.e('Delay').delay(function () {
                    var e;
                    try {
                        _this._verify(sequence);
                    } catch (_error) {
                        e = _error;
                        d.reject(e);
                    }
                }, 40, parts, function () {
                    d.resolve();
                    return this.destroy();
                });
                return d.promise;
            };
        })(this);
    },
    endSequence: function () {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                throw new Error('sequence mismatch');
            };
        })(this);
    },
    checkpoint: function (task) {
        return (function (_this) {
            return function (sequence) {
                _this._verify(sequence);
                _this.currentCheckpoint += 1;
                if (_this._skippingToCheckpoint()) {
                    return WhenJS();
                }
                if (_this.currentCheckpoint === _this.startAtCheckpoint && (task != null)) {
                    return task(sequence);
                } else {
                    return window.ga('send', 'event', 'Game', "Checkpoint " + _this.currentCheckpoint);
                }
            };
        })(this);
    }
};