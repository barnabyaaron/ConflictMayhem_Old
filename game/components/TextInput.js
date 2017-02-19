define([
        'underscore',
        'crafty',
        'when'
    ],
    function(_, Crafty, when) {
        Crafty.c('TextInput',
        {
            init: function() {
                return this.requires('2D, DOM, Text');
            },
            remove: function () { },
            textInput: function(player, length) {
                var index, name;
                this.defer = when.defer();
                name = 'A  ';
                index = 0;
                this.text(name);
                player.bind('Up', (function (_this) {
                    return function () {
                        name = _this._updateText(name, index, 1);
                        return _this.text(name);
                    };
                })(this));
                player.bind('Down', (function (_this) {
                    return function () {
                        name = _this._updateText(name, index, -1);
                        return _this.text(name);
                    };
                })(this));
                player.bind('Left', (function (_this) {
                    return function () {
                        index = Math.max(index - 1, 0);
                        return _this._updateCursor(index);
                    };
                })(this));
                player.bind('Right', (function (_this) {
                    return function () {
                        index = Math.min(index + 1, length - 1);
                        return _this._updateCursor(index);
                    };
                })(this));
                player.bind('Fire', (function (_this) {
                    return function () {
                        var oldIndex;
                        oldIndex = index;
                        index = Math.min(index + 1, length - 1);
                        _this._updateCursor(index);
                        if ((index === oldIndex) && (index === length - 1)) {
                            player.unbind('Up');
                            player.unbind('Down');
                            player.unbind('Left');
                            player.unbind('Right');
                            player.unbind('Fire');
                            return _this.defer.resolve(name);
                        }
                    };
                })(this));
                this.cursor = Crafty.e('2D, DOM, Text').attr({
                    x: this.x,
                    y: this.y,
                    w: this.w
                }).text("_  ").textColor('#0000FF').textAlign("left").textFont({
                    size: '20px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                this.attach(this.cursor);
                return this.defer.promise;
            },
            _updateCursor: function(index) {
                var c;
                c = Array(index + 1).join('&nbsp;') + '_';
                return this.cursor.text(c);
            },
            _updateText: function(name, index, movement) {
                var chars, letter, lindex, nletter;
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.=!$& ';
                letter = name[index];
                lindex = chars.indexOf(letter) + chars.length;
                nletter = chars[(lindex + movement) % chars.length];
                return name.slice(0, index) + nletter + name.slice(index + 1);
            }
        });
    });