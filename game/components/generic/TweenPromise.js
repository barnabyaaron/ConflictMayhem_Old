define([
        'underscore',
        'crafty',
        'when'
    ],
    function (_, Crafty, when) {
        var slice = [].slice;

        Crafty.c('TweenPromise', {
            init: function () {
                return this.requires('Tween');
            },
            tweenPromise: function () {
                var args, d;
                args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                d = when.defer();
                this.one('TweenEnd', function () {
                    return d.resolve();
                });
                this.tween.apply(this, args);
                return d.promise;
            }
        });
    });