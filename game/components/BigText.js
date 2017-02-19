define([
        'underscore',
        'crafty',
        'when'
    ],
    function(_, Crafty, when) {

        Crafty.c('BigText',
        {
            init: function() {
                return this.requires('2D, Text, Tween, Delay, UILayerDOM');
            },
            bigText: function(text, options) {
                var ch, mode, modes, texts;
                if (options == null) {
                    options = {};
                }
                options = _.defaults(options,
                {
                    color: '#EEEEEE',
                    mode: 'fadeIn',
                    "super": null,
                    blink_amount: 3,
                    blink_speed: 1000
                });

                modes = {
                    'fadeIn': {
                        enter: function(els) {
                            var d, el, i, len;
                            d = when.defer();
                            els[0].one('TweenEnd',
                                function() {
                                    return d.resolve();
                                });
                            for (i = 0, len = els.length; i < len; i ++) {
                                el = els[i];
                                el.tween({
                                        alpha: 1
                                    },
                                    3000);
                            }
                            return d.promise;
                        },
                        wait: function(els) {
                            var d;
                            d = when.defer();
                            els[0].delay((function () {
                                return d.resolve();
                            }), 3000, 0);
                            return d.promise;
                        },
                        leave: function(els) {
                            var d, el, i, len;
                            d = when.defer();
                            els[0].one('TweenEnd', function () {
                                return d.resolve();
                            });
                            for (i = 0, len = els.length; i < len; i++) {
                                el = els[i];
                                el.tween({
                                    viewportY: el.viewportY + 100,
                                    alpha: 0
                                }, 1500);
                            }
                            return d.promise;
                        }
                    },
                    'blink': {
                        enter: function(els) {
                            var el, i, len;
                            for (i = 0, len = els.length; i < len; i++) {
                                el = els[i];
                                el.attr({
                                    alpha: 1
                                });
                            }
                            return when();
                        },
                        wait: function(els) {
                            var d;
                            d = when.defer();
                            els[0].delay((function () {
                                var e, i, len, results;
                                results = [];
                                for (i = 0, len = els.length; i < len; i++) {
                                    e = els[i];
                                    results.push(e.attr({
                                        alpha: (e.alpha + 1) % 2
                                    }));
                                }
                                return results;
                            }), options.blink_speed, ((options.blink_amount - 1) * 2) + 1, (function () {
                                return d.resolve();
                            }));
                            return d.promise;
                        },
                        leave: function(els) {
                            var el, i, len;
                            for (i = 0, len = els.length; i < len; i++) {
                                el = els[i];
                                el.attr({
                                    alpha: 0
                                });
                            }
                            return when();
                        }
                    }
                };

                texts = [this];
                if (options["super"] != null) {
                    ch = Crafty.e("2D, Text, Tween, UILayerDOM").attr({
                        w: Crafty.viewport.width,
                        z: 1,
                        alpha: 0
                    }).textAlign('center').text(options["super"]).attr({
                        x: this.x,
                        y: 200,
                        z: -1
                    }).textColor(options.color).textFont({
                        size: '16px',
                        weight: 'bold',
                        family: 'Press Start 2P'
                    });
                    texts.push(ch);
                }

                this.attr({
                    w: Crafty.viewport.width,
                    z: 1,
                    alpha: 0
                }).textAlign('center').text(text).attr({
                    x: this.x,
                    y: 240,
                    z: -1
                }).textColor(options.color).textFont({
                    size: '30px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });

                mode = modes[options.mode];
                return mode.enter(texts).then(function () {
                    return mode.wait(texts).then(function () {
                        return mode.leave(texts).then(function () {
                            var i, len, results, t;
                            results = [];
                            for (i = 0, len = texts.length; i < len; i++) {
                                t = texts[i];
                                results.push(t.destroy());
                            }
                            return results;
                        });
                    });
                });
            }
        });

    });