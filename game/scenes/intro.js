define([
        'underscore',
        'crafty',
        'storage',
        'require',
        'game/classes/classic'
], function (_, Crafty, storage, require) {
    var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

    var Scene = {
        name: "intro",
        init: function (options) {
            var self = this;
            storage.set("classic_mode", false);
            storage.set("level", 1);

            Crafty.background('#000 url(assets/images/black.png) repeat left top');

            var ctrl = require('game/classes/classic');
            this.Ctrl = new ctrl(options);

            Crafty.bind("EnterFrame", this.Ctrl.update);

            // Create Debug Commands if Debug Enabled
            if (storage.get('DEBUG_MODE') === true) {
                Crafty.bind("KeyDown",
                    function(e) {
                        if (e.key === Crafty.keys.F2) {
                            // Win Level
                            Crafty.unbind("EnterFrame", self.Ctrl.update);
                            self.Ctrl.victory();
                        }
                    });
            }
        },
        uninit: function () { }
    };

    return Scene;
});