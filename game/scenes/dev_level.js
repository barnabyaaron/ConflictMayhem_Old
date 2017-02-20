define([
        'underscore',
        'crafty',
        'storage',
        'app'
], function (_, Crafty, storage, Game) {

    var Scene = {
        name: "dev_level",
        init: function (options) {
            var self = this;
            
            Crafty.background('#000 url(assets/images/black.png) repeat left top');

            Crafty.e("2D, DOM, Text").attr({
                x: 10,
                y: 5,
                w: 300
            }).unselectable().textColor('#FFF').textFont({
                size: '30px',
                family: 'KenVector Future'
            }).text("Dev Level");

            if (storage.get('DEBUG_MODE') === true) {
                Crafty.bind("KeyDown",
                    function (e) {
                        if (e.key === Crafty.keys.F10) {
                            // Return to Menu
                            options.changeScene('menu');
                        }
                    });
            }

            Game.TestExt.print("Testing Test Ext General.");
            Crafty.bind("KeyDown",
                function(e) {
                    if (e.key === Crafty.keys.T) {
                        Game.TestExt.print("Testing Test Ext KeyDown.");
                    }
                });

            // Create Frank
            var frank = Crafty.e("Frank");
            frank.spawn(100, 100);
        },
        uninit: function () { }
    };

    return Scene;
});