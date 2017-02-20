var Game,
  bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

Game = this.Game;

Game.PauseMenu = (function () {
    function PauseMenu() {
        this._handleFire = bind(this._handleFire, this);
        this._handleDown = bind(this._handleDown, this);
        this._handleUp = bind(this._handleUp, this);
        Crafty.bind('GamePause', (function (_this) {
            return function (state) {
                if (state) {
                    _this.createMenu();
                    return _this.showPlayers();
                } else {
                    return _this.remove();
                }
            };
        })(this));
    }

    PauseMenu.prototype.createMenu = function () {
        return this._buildMenu([
          {
              text: 'Resume',
              execute: function () {
                  return Game.togglePause();
              }
          }, {
              text: function () {
                  if (Crafty.audio.muted) {
                      return 'Sound [off]';
                  } else {
                      return 'Sound [on]';
                  }
              },
              execute: function () {
                  Crafty.audio.toggleMute();
                  return Game.changeSettings({
                      sound: !Crafty.audio.muted
                  });
              }
          }, {
              text: 'Restart',
              execute: function () {
                  Game.togglePause();
                  Game.resetCredits();
                  Crafty('Player').each(function () {
                      return this.softReset();
                  });
                  return Crafty.enterScene(Game.firstLevel);
              }
          }, {
              text: 'Quit',
              execute: function () {
                  Game.togglePause();
                  Crafty('Player').each(function () {
                      return this.reset();
                  });
                  return Crafty.enterScene('Intro');
              }
          }
        ]);
    };

    PauseMenu.prototype._buildMenu = function (options) {
        var i, j, len, menu, menuItem, o, ref, ref1, self, title;
        this.options = options;
        menu = Crafty.e('2D, DOM, Color, PauseMenu').attr({
            x: -Crafty.viewport.x + (.35 * Crafty.viewport.width),
            y: (Crafty.viewport.height * .3) - Crafty.viewport.y,
            w: .3 * Crafty.viewport.width,
            h: (this.options.length + 2) * 32,
            z: 100,
            alpha: .5
        }).color('#000000');
        title = Crafty.e('2D, DOM, Text').attr({
            x: menu.x,
            y: menu.y + 20,
            w: menu.w,
            z: 110
        }).text('Game Paused').textColor('#D0D0D0').textAlign('center').textFont({
            size: '15px',
            weight: 'bold',
            family: 'Press Start 2P'
        });
        menu.attach(title);
        ref = this.options;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            o = ref[i];
            menuItem = Crafty.e('2D, DOM, Text').attr({
                x: menu.x + 60,
                y: menu.y + 50 + (35 * i),
                w: menu.w - 60,
                z: 110
            }).text((ref1 = typeof o.text === "function" ? o.text() : void 0) != null ? ref1 : o.text).textColor('#D0D0D0').textAlign('left').textFont({
                size: '15px',
                weight: 'bold',
                family: 'Press Start 2P'
            });
            menu.attach(menuItem);
            o.entity = menuItem;
        }
        this.selected = 0;
        this.selectionChar = Crafty.e('2D, DOM, Text').attr({
            x: menu.x + 20,
            w: 40,
            z: 110
        }).text('>').textColor('#0000FF').textAlign('left').textFont({
            size: '15px',
            weight: 'bold',
            family: 'Press Start 2P'
        });
        menu.attach(this.selectionChar);
        this.updateSelection();
        self = this;
        return Crafty('Player').each(function () {
            this.bind('Up', self._handleUp);
            this.bind('Down', self._handleDown);
            return this.bind('Fire', self._handleFire);
        });
    };

    PauseMenu.prototype._handleUp = function () {
        this.selected = (this.options.length + this.selected - 1) % this.options.length;
        return this.updateSelection();
    };

    PauseMenu.prototype._handleDown = function () {
        this.selected = (this.options.length + this.selected + 1) % this.options.length;
        return this.updateSelection();
    };

    PauseMenu.prototype.updateSelection = function () {
        return this.selectionChar.attr({
            y: this.options[this.selected].entity.y
        });
    };

    PauseMenu.prototype._handleFire = function () {
        return setTimeout((function (_this) {
            return function () {
                var ref, selected;
                selected = _this.options[_this.selected];
                selected.execute();
                return selected.entity.text((ref = typeof selected.text === "function" ? selected.text() : void 0) != null ? ref : selected.text);
            };
        })(this));
    };

    PauseMenu.prototype.showPlayers = function () {
        return Crafty('Player').each(function () {
            var base, i, icon, j, len, o, results, s, stat, statList, stats, xOff;
            if (!this.ship) {
                return;
            }
            xOff = .05;
            if (this.playerNumber === 2) {
                xOff = .70;
            }
            if (typeof (base = Crafty.e('2D, WebGL, playerShip, ColorEffects, PauseMenu').attr({
                w: 71,
                h: 45,
                x: -Crafty.viewport.x + ((xOff + .07) * Crafty.viewport.width),
                y: (Crafty.viewport.height * .3) - Crafty.viewport.y + 20,
                z: 101
            }).flip('X')).colorOverride === "function") {
                base.colorOverride(this.color(), 'partial');
            }
            statList = ["Score: " + this.points, "Lives: " + (this.lives - 1), "", "&nbsp;&nbsp; Speed: &nbsp;&nbsp;&nbsp;&nbsp;+" + this.ship.primaryWeapon.stats.speed, "&nbsp;&nbsp; RapidFire: +" + this.ship.primaryWeapon.stats.rapid, "&nbsp;&nbsp; AimAssist: +" + this.ship.primaryWeapon.stats.aim, "&nbsp;&nbsp; Damage: &nbsp;&nbsp;&nbsp;+" + this.ship.primaryWeapon.stats.damage];
            stats = Crafty.e('2D, WebGL, Color, PauseMenu').attr({
                x: -Crafty.viewport.x + (xOff * Crafty.viewport.width),
                y: (Crafty.viewport.height * .3) - Crafty.viewport.y,
                w: .25 * Crafty.viewport.width,
                h: (statList.length + 5) * 20,
                z: 100,
                alpha: .3
            }).color('#000');
            results = [];
            for (i = j = 0, len = statList.length; j < len; i = ++j) {
                o = statList[i];
                stat = Crafty.e('2D, DOM, Text').attr({
                    x: stats.x + 20,
                    y: stats.y + 85 + (20 * i),
                    w: stats.w - 60,
                    z: 110
                }).text(o).textColor('#D0D0D0').textAlign('left').textFont({
                    size: '8px',
                    weight: 'bold',
                    family: 'Press Start 2P'
                });
                stats.attach(stat);
                if ((2 < i && i < 7)) {
                    s = ['speedBoost', 'rapidFireBoost', 'aimBoost', 'damageBoost'];
                    icon = Crafty.e('2D, WebGL, ColorEffects, PauseMenu').addComponent(s[i - 3]).attr({
                        x: stats.x + 20,
                        y: stats.y + 82 + (20 * i),
                        w: 12,
                        h: 12,
                        z: 110
                    }).colorOverride('white', 'partial');
                    results.push(stats.attach(icon));
                } else {
                    results.push(void 0);
                }
            }
            return results;
        });
    };

    PauseMenu.prototype.remove = function () {
        var self;
        self = this;
        Crafty('Player').each(function () {
            this.unbind('Up', self._handleUp);
            this.unbind('Down', self._handleDown);
            return this.unbind('Fire', self._handleFire);
        });
        return Crafty('PauseMenu').each(function () {
            return this.destroy();
        });
    };

    return PauseMenu;

})();