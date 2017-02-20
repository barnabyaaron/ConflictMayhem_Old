var Game;

Game = this.Game;

if (Game.ScriptTemplate == null) {
    Game.ScriptTemplate = {};
}

Game.ScriptTemplate.Level = {
    oldExplosion: function (location, options) {
        if (options == null) {
            options = {};
        }
        return (function (_this) {
            return function (sequence) {
                var e, ref, x, y;
                _this._verify(sequence);
                ref = location(), x = ref.x, y = ref.y;
                x -= Crafty.viewport.x;
                y -= Crafty.viewport.y;
                options = _.defaults({
                    x: x,
                    y: y
                }, options, {
                    damage: 0,
                    radius: 20,
                    duration: 160,
                    z: 5,
                    alpha: 1.0
                });
                e = Crafty.e('OldExplosion').explode(options);
                if (options.damage) {
                    return e.addComponent('Hostile');
                }
            };
        })(this);
    },
    smallExplosion: function (options) {
        if (options == null) {
            options = {};
        }
        options = _.defaults(options, {
            juice: true,
            offsetX: 0,
            offsetY: 0
        });
        if (options.juice === false) {
            return this.blast(this.location());
        } else {
            return this.parallel(this.blast(this.location({
                offsetX: options.offsetX,
                offsetY: options.offsetY
            }), {
                alpha: .85
            }), (function (_this) {
                return function () {
                    return Crafty.audio.play("explosion", 1, .25);
                };
            })(this));
        }
    },
    bigExplosion: function (options) {
        if (options == null) {
            options = {};
        }
        options = _.defaults(options, {
            juice: true,
            offsetX: 0,
            offsetY: 0,
            damage: 300
        });
        if (options.juice === false) {
            return this.blast(this.location(), {
                damage: options.damage,
                radius: 40
            });
        } else {
            return this.parallel(this.screenShake(10, {
                duration: 200
            }), (function (_this) {
                return function () {
                    return Crafty.audio.play("explosion");
                };
            })(this), this.blast(this.location({
                offsetX: options.offsetX,
                offsetY: options.offsetY
            }), {
                damage: options.damage,
                radius: 40
            }));
        }
    }
};