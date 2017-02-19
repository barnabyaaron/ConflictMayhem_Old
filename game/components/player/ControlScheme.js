define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('ControlScheme', {
            init: function () {
                if (!this.has('Cheats')) {
                    this.addComponent('Cheats');
                }
                this.trigger('Activated');
                return Crafty.trigger('PlayerActivated');
            },
            remove: function () {
                this.removeComponent('Cheats');
                this.trigger('Deactivated');
                return Crafty.trigger('PlayerDeactivated');
            }
        });
    });