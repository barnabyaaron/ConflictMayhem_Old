define([
        'underscore',
        'crafty'
    ],
    function(_, Crafty) {
        Crafty.c('Projectile',
        {
            init: function() {
                return this.requires('2D, WebGL, ViewportFixed');
            },
            shoot: function(x, y, angle) {
                this.attr({
                    x: x,
                    y: y,
                    rotation: angle
                });
                this.bind('GameLoop', function (fd) {
                    var dist;
                    dist = fd.dt * (this.speed / 1000);
                    this.x -= Math.cos(this.rotation / 180 * Math.PI) * dist;
                    this.y -= Math.sin(this.rotation / 180 * Math.PI) * dist;
                    if (this.x < -Crafty.viewport.x || this.x > -Crafty.viewport.x + Crafty.viewport.width) {
                        this.destroy();
                    }
                    if (this.y < -Crafty.viewport.y || this.y > -Crafty.viewport.y + Crafty.viewport.height) {
                        return this.destroy();
                    }
                });
                return this;
            }
        });
    });