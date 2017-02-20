define([
        'underscore',
        'crafty',
        'when'
    ],
    function(_, Crafty, when) {
        var slice = [].slice;

        return function(speaker, text, settings) {
            var avatar, avatarOffset, back, defer, h, i, j, len, line, lines, offset, portrait, ref, speakerText, w, x;
            Crafty('Dialog').each(function() {
                this.trigger('Abort');
                return this.destroy();
            });
            lines = text.split('\n');
            x = 60;
            defer = when.defer();
            w = Crafty.viewport.width * .8;
            h = lines.length + 1;
            if (speaker != null) {
                h += 1;
            }

            avatar = (function() {
                switch (speaker) {
                    case 'General':
                        return {
                            n: 'pGeneral',
                            l: [0, 0]
                        };
                    case 'Pilot':
                        return {
                            n: 'pPilot',
                            l: [0, 4]
                        };
                }
            })();
            if (avatar) {
                h = Math.max(4, h);
            }

            back = Crafty.e('2D, UILayerWebGL, Color, Tween, Dialog').attr({
                w: w,
                h: h * 20,
                alpha: 0.7
            }).color('#000000').attr({
                x: x - 10,
                y: settings.bottom - (h * 20),
                z: 100
            });
            back.bind('Abort',
                function() {
                    return defer.resolve();
                });

            avatarOffset = avatar ? 100 : 0;
            if (avatar != null) {
                portrait = (ref = Crafty.e('2D, UILayerWebGL, SpriteAnimation').addComponent(avatar.n)).sprite.apply(ref, slice.call(avatar.l).concat([4], [4])).attr({
                    x: back.x + 5,
                    y: back.y - 20,
                    z: back.z + 1,
                    w: 96,
                    h: 96
                }).reel('talk', 400, [avatar.l, [avatar.l[0] + 4, avatar.l[1]]]).animate('talk', lines.length * 6);
                back.attach(portrait);
                if (settings.noise !== 'none' && (avatar != null)) {
                    portrait.addComponent('Delay');
                    portrait.delay(function () {
                        return portrait.attr({
                            alpha: .6 + (Math.random() * .3)
                        });
                    }, 150, -1);
                }
            }
            ffset = 15;
            if (speaker != null) {
                speakerText = Crafty.e('2D, UILayerDOM, Text').attr({
                    w: w - 20,
                    x: back.x + 10 + avatarOffset,
                    y: back.y + 10,
                    z: 101,
                    alpha: 1
                }).text(speaker).textColor('#707070').textFont({
                    size: '10px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                back.attach(speakerText);
                offset = 30;
            }
            for (i = j = 0, len = lines.length; j < len; i = ++j) {
                line = lines[i];
                back.attach(Crafty.e('2D, UILayerDOM, Text').attr({
                    w: w - 20,
                    x: back.x + 10 + avatarOffset,
                    y: back.y + offset + (i * 20),
                    z: 101
                }).text(line).textColor('#909090').textFont({
                    size: '10px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                }));
            }
            Crafty.e('Dialog, Delay').delay(function () {
                defer.resolve();
                return Crafty('Dialog').each(function () {
                    return this.destroy();
                });
            }, 3000 * lines.length, 0);
            return defer.promise;
        };
    });