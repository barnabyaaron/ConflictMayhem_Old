var Game;

Game = this.Game;

if (Game.ScriptModule == null) {
    Game.ScriptModule = {};
}

Game.ScriptModule.Colors = {
    backgroundColorFade: function (settings, bottomColors, topColors) {
        return (function (_this) {
            return function (sequence) {
                var d, ref;
                Crafty.background(bottomColors[0]);
                Crafty.bind('BackgroundColor', _this._colorHorizon);
                Crafty.trigger('BackgroundColor', bottomColors[0]);
                d = WhenJS.defer();
                Crafty('Sky').get(0).colorFade({
                    duration: settings.duration,
                    skip: (ref = settings.skip) != null ? ref : 0
                }, bottomColors, topColors).bind('ColorFadeFinished', function () {
                    var c;
                    c = bottomColors[bottomColors.length - 1];
                    Game.backgroundColor = c;
                    Crafty('Horizon').each(function () {
                        return this.colorDesaturation(c);
                    });
                    Crafty.unbind('BackgroundColor', this._colorHorizon);
                    return d.resolve();
                });
                return d.promise;
            };
        })(this);
    },
    _colorHorizon: function (color) {
        if (Game.backgroundColor === color) {
            return;
        }
        Game.backgroundColor = color;
        return Crafty('Horizon').each(function () {
            return this.colorDesaturation(color);
        });
    }
};

Crafty.c('Horizon', {
    init: function () {
        this.requires('ColorEffects');
        return this.colorDesaturation(Game.backgroundColor);
    }
});