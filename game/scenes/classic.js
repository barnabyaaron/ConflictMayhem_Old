define([
        'underscore',
        'crafty',
        'storage',
        'require',
        'game/classes/classic'
], function (_, Crafty, storage, require) {
    var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

    var Scene = {
        name: "classic",
        init: function (options) {
            storage.set("classic_mode", true);

            Crafty.background('rgb(32, 55, 67)');

            var ctrl = require('game/classes/classic');
            this.Ctrl = new ctrl();

            Crafty.bind("EnterFrame", this.Ctrl.update);
        },
        uninit: function () { }
    };

    return Scene;
});