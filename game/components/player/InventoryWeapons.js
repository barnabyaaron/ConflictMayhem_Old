define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('InventoryWeapons', {
            init: function () { },
            stats: function (newStats) {
                var ref, ref1, ref2, ref3, ref4, ref5, stats;
                if (newStats == null) {
                    newStats = {};
                }
                if (newStats.primary != null) {
                    this.primaryWeapon.stats = newStats.primary.stats;
                    this.primaryWeapon._determineWeaponSettings();
                }
                stats = {};
                stats['primary'] = {
                    stats: (ref = (ref1 = this.primaryWeapon) != null ? ref1.stats : void 0) != null ? ref : {},
                    boosts: (ref2 = (ref3 = this.primaryWeapon) != null ? ref3.boosts : void 0) != null ? ref2 : {},
                    boostTimings: (ref4 = (ref5 = this.primaryWeapon) != null ? ref5.boostTimings : void 0) != null ? ref4 : {}
                };
                return stats;
            },
            installItem: function (item) {
                var base;
                if (item == null) {
                    return;
                }
                if (item.type === 'weapon') {
                    if (this.hasItem(item.contains)) {
                        return;
                    }
                    this.items.push(item);
                    if (item.contains === 'lasers') {
                        this._installPrimary('RapidWeaponLaser');
                        return true;
                    }
                    if (item.contains === 'oldlasers') {
                        this._installPrimary('OldWeaponLaser');
                        return true;
                    }
                    if (item.contains === 'diagonals') {
                        this._installPrimary('RapidDiagonalLaser');
                        return true;
                    }
                }
                if (item.type === 'ship') {
                    if (item.contains === 'life') {
                        this.scoreText('Extra life!');
                        return true;
                    }
                    if (item.contains === 'points') {
                        this.scoreText('+500 points!');
                        return true;
                    }
                    if (item.contains === 'xp') {
                        if (typeof (base = this.primaryWeapon).addXP === "function") {
                            base.addXP(1000);
                        }
                        return true;
                    }
                }
                if (item.type === 'weaponUpgrade') {
                    this.primaryWeapon.upgrade(item.contains);
                    return true;
                }
                if (item.type === 'weaponBoost') {
                    this.primaryWeapon.boost(item.contains);
                    return true;
                }
            }
        });
    });