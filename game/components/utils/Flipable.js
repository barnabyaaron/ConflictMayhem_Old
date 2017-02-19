define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Flipable', {
            flipX: function () {
                var c, e, j, len, ref, relX;
                if (this.xFlipped) {
                    return;
                }
                this.xFlipped = true;
                try {
                    if (typeof this.flip === "function") {
                        this.flip('X');
                    }
                    ref = this._children;
                    for (j = 0, len = ref.length; j < len; j++) {
                        c = ref[j];
                        relX = c.x - this.x;
                        if (typeof c.attr === "function") {
                            c.attr({
                                x: this.x + this.w - c.w - relX
                            });
                        }
                        if (typeof c.flip === "function") {
                            c.flip('X');
                        }
                    }
                } catch (_error) {
                    e = _error;
                    console.log(e);
                }
                this._mirrorCollision();
                this._mirrorRotationPoints();
                this._mirrorWeaponOrigin();
                return this;
            },
            unflipX: function () {
                var c, e, j, len, ref, relX;
                if (!this.xFlipped) {
                    return;
                }
                this.xFlipped = false;
                try {
                    if (typeof this.unflip === "function") {
                        this.unflip('X');
                    }
                    ref = this._children;
                    for (j = 0, len = ref.length; j < len; j++) {
                        c = ref[j];
                        relX = this.x + this.w - (c.x + c.w);
                        if (typeof c.attr === "function") {
                            c.attr({
                                x: this.x + relX
                            });
                        }
                        if (typeof c.unflip === "function") {
                            c.unflip('X');
                        }
                    }
                } catch (_error) {
                    e = _error;
                    console.log(e);
                }
                this._mirrorCollision();
                this._mirrorRotationPoints();
                this._mirrorWeaponOrigin();
                return this;
            },
            _mirrorCollision: function () {
                var dx, i, j, len, p, ref, results;
                if (!this.map.points) {
                    return;
                }
                ref = this.map.points;
                results = [];
                for (i = j = 0, len = ref.length; j < len; i = ++j) {
                    p = ref[i];
                    if (i % 2 === 0) {
                        dx = p - this.x;
                        results.push(this.map.points[i] = this.x + (this.w - dx));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            },
            _mirrorRotationPoints: function () {
                var c, j, len, ref, results;
                this._origin.x = this.w - this._origin.x;
                ref = this._children;
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                    c = ref[j];
                    if (c.origin != null) {
                        c._origin.x = c.w - c._origin.x;
                    }
                    results.push(c.rotation = (360 + (360 - c.rotation)) % 360);
                }
                return results;
            },
            _mirrorWeaponOrigin: function () {
                if (this.weaponOrigin == null) {
                    return;
                }
                return this.weaponOrigin = [this.w - this.weaponOrigin[0], this.weaponOrigin[1]];
            }
        });
    });