define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('ColorFade', {
            colorFade: function (options, bottomColors, topColors) {
                var ref, skip;
                this.bottomColors = bottomColors;
                this.topColors = topColors;
                this.duration = options.duration, skip = options.skip;
                this.v = 0;
                this.v += (ref = Math.max(skip, 0)) != null ? ref : 0;
                return this.bind('GameLoop', this._recolor);
            },
            remove: function () {
                return this.unbind('GameLoop', this._recolor);
            },
            _recolor: function (fd) {
                var bcolor, pos, tcolor;
                this.v += fd.dt;
                pos = this.v / this.duration;
                if (pos < 0) {
                    pos = 0;
                }
                if (pos >= 1) {
                    this.unbind('GameLoop', this._recolor);
                    this.trigger('ColorFadeFinished');
                    pos = 1;
                }
                bcolor = this._buildColor(pos, this.bottomColors);
                tcolor = this._buildColor(pos, this.topColors);
                Crafty.trigger('BackgroundColor', bcolor);
                Crafty.background(bcolor);
                this.bottomColor(bcolor);
                return this.topColor(tcolor);
            },
            _buildColor: function (v, colors) {
                var from, index, localV, parts, ref, to;
                parts = 1 / (colors.length - 1);
                index = Math.floor(v / parts);
                from = colors[index];
                to = (ref = colors[index + 1]) != null ? ref : from;
                localV = (v - (index * parts)) / parts;
                return this._mix(localV, from, to);
            },
            _mix: function (v, from, to) {
                var c, f, i, k, t;
                f = this._strToColor(from);
                t = this._strToColor(to);
                c = {
                    r: Math.round(f.r * (1 - v) + t.r * v),
                    g: Math.round(f.g * (1 - v) + t.g * v),
                    b: Math.round(f.b * (1 - v) + t.b * v)
                };
                return "#" + (((function () {
                    var results;
                    results = [];
                    for (k in c) {
                        i = c[k];
                        results.push(('0' + i.toString(16)).slice(-2));
                    }
                    return results;
                })()).join(''));
            },
            _strToColor: function (string) {
                return {
                    r: parseInt(string.slice(1, 3), 16),
                    g: parseInt(string.slice(3, 5), 16),
                    b: parseInt(string.slice(5, 7), 16)
                };
            }
        });
    });