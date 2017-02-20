var Game,
  indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Game = this.Game;

Game.LevelGenerator = (function () {
    function LevelGenerator() {
        this.buildingBlocks = {};
        this.elements = {};
        this.assets = {};
    }

    LevelGenerator.prototype.defineBlock = function (klass) {
        return this.buildingBlocks[klass.prototype.name] = klass;
    };

    LevelGenerator.prototype.defineElement = function (name, constructor) {
        return this.elements[name] = constructor;
    };

    LevelGenerator.prototype.defineAssets = function (name, object) {
        return this.assets[name] = object;
    };

    LevelGenerator.prototype.loadAssets = function (names) {
        var name, p;
        p = (function () {
            var i, len, results;
            results = [];
            for (i = 0, len = names.length; i < len; i++) {
                name = names[i];
                results.push(this._loadAssetMap(name));
            }
            return results;
        }).call(this);
        return WhenJS.all(p);
    };

    LevelGenerator.prototype._loadAssetMap = function (name) {
        var assetMap, assetName, assetObject, d, items, mapping, obj, object, queue, ref, sprite;
        if (this.entityAssets == null) {
            this.entityAssets = {};
        }
        assetMap = null;
        assetObject = null;
        ref = this.assets;
        for (assetName in ref) {
            object = ref[assetName];
            if (indexOf.call(object.contents, name) >= 0) {
                assetMap = assetName;
                assetObject = object;
            }
        }
        if (!assetMap) {
            throw new Error("no asset map defined for " + name);
        }
        if (this.entityAssets[assetMap]) {
            return this.entityAssets[assetMap].promise;
        }
        d = WhenJS.defer();
        this.entityAssets[assetMap] = {
            assets: assetObject,
            promise: d.promise
        };
        sprite = assetObject.spriteMap;
        queue = (function () {
            var ref1, results;
            ref1 = assetObject.sprites;
            results = [];
            for (mapping in ref1) {
                items = ref1[mapping];
                obj = {
                    sprites: {}
                };
                obj.sprites[sprite] = items;
                results.push(obj);
            }
            return results;
        })();
        queue[0].audio = assetObject.audio;
        Crafty.load(queue.pop(), function () {
            var current, fileUrl;
            while (queue.length > 0) {
                current = queue.pop().sprites[sprite];
                fileUrl = Crafty.paths().images + sprite;
                Crafty.sprite(current.tile, current.tileh, fileUrl, current.map, current.paddingX, current.paddingY, current.paddingAroundBorder);
            }
            return d.resolve();
        });
        return d.promise;
    };

    LevelGenerator.prototype.createLevel = function (data) {
        if (data == null) {
            data = {
                namespace: 'City'
            };
        }
        return new Game.Level(this, data);
    };

    return LevelGenerator;

})();

Game.levelGenerator = new Game.LevelGenerator;