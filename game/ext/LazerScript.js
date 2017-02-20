define([
    'underscore',
    'crafty',
    'when'
    ], function (_, Crafty, when) {
    var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
        slice = [].slice,
        extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        hasProp = {}.hasOwnProperty;

    return (function() {
        function LazerScript(level) {
            this.level = level;
            this._endScriptOnGameOver = bind(this._endScriptOnGameOver, this);
        }

        LazerScript.prototype.run = function() {
            var args, loadingAssets, ref;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            this.currentSequence = Math.random();
            this.options = (ref = args[0]) != null ? ref : {};
            this.startAtCheckpoint = this.options.startAtCheckpoint;
            this.currentCheckpoint = 0;
            loadingAssets = when(true);
            if (this.assets != null) {
                loadingAssets = this.assets(this.options)(this.currentSequence);
            }
            return loadingAssets.then((function(_this) {
                return function() {
                    return _this.initialize.apply(_this, args);
                };
            })(this));
        };

        LazerScript.prototype.end = function () {
            return this.currentSequence = null;
        };

        LazerScript.prototype.initialize = function () {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            Crafty.bind('PlayerDied', this._endScriptOnGameOver);
            return when(this.execute.apply(this, args)(this.currentSequence))["finally"]((function (_this) {
                return function () {
                    return Crafty.unbind('PlayerDied', _this._endScriptOnGameOver);
                };
            })(this));
        };

        LazerScript.prototype.execute = function () { };

        LazerScript.prototype._endScriptOnGameOver = function () {
            var playersActive;
            playersActive = false;
            Crafty('Player ControlScheme').each(function () {
                if (this.lives > 0) {
                    return playersActive = true;
                }
            });
            if (!playersActive) {
                return this.currentSequence = null;
            }
        };

        return LazerScript;
    })();
});