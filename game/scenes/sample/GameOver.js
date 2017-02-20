Crafty.defineScene('GameOver', function (data) {
    var Game, collect, h, hs, task, text, w;
    Game = window.Game;
    Crafty.background('#000');
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    w = Crafty.viewport.width;
    h = Crafty.viewport.height;
    text = 'Game Over';
    if (data.gameCompleted) {
        text = 'Congratulations';
    }
    Crafty.e('2D, DOM, Text').attr({
        x: 0,
        y: h * .2,
        w: w
    }).text(text).textColor('#FF0000').textAlign('center').textFont({
        size: '50px',
        weight: 'bold',
        family: 'Press Start 2P'
    });
    task = function (data) {
        return function () {
            var highScorePos, i, j, k, len, p, rank, s, t;
            highScorePos = null;
            for (i = j = 0, len = hs.length; j < len; i = ++j) {
                s = hs[i];
                if (s.player === data.player) {
                    highScorePos = i;
                }
            }
            t = data.name + ": " + data.points;
            if (highScorePos < 10) {
                rank = (function () {
                    switch (highScorePos) {
                        case 0:
                            return 'ACE';
                        case 1:
                            return '2nd';
                        case 2:
                            return '3rd';
                        default:
                            return (highScorePos + 1) + "th";
                    }
                })();
                t += " - " + rank;
            }
            Crafty.e('2D, DOM, Text').attr({
                x: 0,
                y: (h * .45) + (data.index * 45),
                w: w
            }).text(t).textColor(data.color).textAlign('center').textFont({
                size: '20px',
                weight: 'bold',
                family: 'Press Start 2P'
            });
            if (highScorePos < 10) {
                p = Crafty.e('2D, DOM, Text').attr({
                    x: w * .25,
                    y: (h * .45) + ((data.index + 1) * 45),
                    w: w
                }).text("Enter name: ").textColor(data.color).textAlign('left').textFont({
                    size: '20px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                k = Crafty.e('TextInput').attr({
                    x: w * .6,
                    y: (h * .45) + ((data.index + 1) * 45),
                    w: w
                }).textColor(data.color).textAlign('left').textFont({
                    size: '20px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                return k.textInput(data.player, 3).then(function (name) {
                    var d, ed, ky, l, loadList;
                    loadList = function () {
                        var d, dat, ko, v;
                        dat = localStorage.getItem('SPDLZR');
                        if (!dat) {
                            return [];
                        }
                        ko = dat.slice(0, 20);
                        d = dat.slice(20);
                        s = CryptoJS.AES.decrypt(d, ko);
                        v = s.toString(CryptoJS.enc.Utf8);
                        if (!(v.length > 1)) {
                            return [];
                        }
                        return JSON.parse(v);
                    };
                    l = loadList();
                    l.push({
                        initials: name,
                        score: data.points,
                        time: (new Date).getTime()
                    });
                    d = JSON.stringify(l);
                    ky = CryptoJS.AES.encrypt(d, 'secret').toString().slice(8, 28);
                    ed = CryptoJS.AES.encrypt(d, ky).toString();
                    localStorage.setItem('SPDLZR', ky + ed);
                    p.destroy();
                    return k.destroy();
                });
            }
        };
    };
    collect = [];
    hs = _.clone(Game.highscores());
    Crafty('Player ControlScheme').each(function (index) {
        var highscoreEntry;
        highscoreEntry = null;
        hs.push({
            initials: null,
            player: this,
            score: this.points
        });
        collect.push(task({
            index: index,
            name: this.name,
            points: this.points,
            player: this,
            color: this.color()
        }));
        return window.ga('send', 'event', 'Game', 'Score', void 0, this.points);
    });
    hs = _.sortBy(hs, 'score').reverse();
    return WhenJS.sequence(collect).then((function (_this) {
        return function () {
            return Crafty.e('Delay').delay(function () {
                var e, prefix, time;
                if (Game.credits > 0 && !data.gameCompleted) {
                    time = 10;
                    text = Game.credits === 1 ? "1 Credit left" : Game.credits + " Credits left";
                    Crafty.e('2D, DOM, Text').attr({
                        x: 0,
                        y: h * .8,
                        w: w
                    }).textColor('#FF0000').textAlign('center').textFont({
                        size: '15px',
                        weight: 'bold',
                        family: 'Press Start 2P'
                    }).text(text);
                    e = Crafty.e('2D, DOM, Text').attr({
                        x: 0,
                        y: (h * .8) + 30,
                        w: w
                    }).textColor('#FF0000').textAlign('center').textFont({
                        size: '15px',
                        weight: 'bold',
                        family: 'Press Start 2P'
                    });
                    prefix = "Press fire to continue";
                    e.text(prefix + " " + (("00" + time).slice(-2)));
                    this.delay(function () {
                        time -= 1;
                        return e.text(prefix + " " + (("00" + time).slice(-2)));
                    }, 1000, time, function () {
                        return Crafty.enterScene('Scores');
                    });
                    return Crafty('Player').each(function () {
                        this.reset();
                        return this.one('Activated', function () {
                            Game.credits -= 1;
                            return Crafty.enterScene(Game.firstLevel, data);
                        });
                    });
                } else {
                    return this.delay(function () {
                        return Crafty.enterScene('Scores');
                    }, 5000);
                }
            }, 2000, 0);
        };
    })(this));
}, function () {
    Crafty('Delay').each(function () {
        return this.destroy();
    });
    return Crafty('Player').each(function () {
        return this.unbind('Activated');
    });
});

// ---
// generated by coffee-script 1.9.2