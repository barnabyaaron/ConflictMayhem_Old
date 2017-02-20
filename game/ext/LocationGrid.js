var Game;

Game = this.Game;

Game.LocationGrid = (function () {
    function LocationGrid(settings) {
        var coords, j, k, len, len1, x, xPerc, xs, y, yPerc, ys;
        settings = _.defaults(settings, {
            x: {},
            y: {}
        });
        settings.x = _.defaults(settings.x, {
            start: 0,
            steps: 1,
            stepSize: 1
        });
        settings.y = _.defaults(settings.y, {
            start: 0,
            steps: 1,
            stepSize: 1
        });
        xs = this._coordList(settings.x);
        ys = this._coordList(settings.y);
        coords = [];
        for (j = 0, len = ys.length; j < len; j++) {
            y = ys[j];
            for (k = 0, len1 = xs.length; k < len1; k++) {
                x = xs[k];
                xPerc = (x - settings.x.start) / (settings.x.stepSize * settings.x.steps);
                yPerc = (y - settings.y.start) / (settings.y.stepSize * settings.y.steps);
                coords.push({
                    x: x,
                    y: y,
                    xPerc: xPerc,
                    yPerc: yPerc
                });
            }
        }
        this.freeCoords = _.shuffle(coords);
    }

    LocationGrid.prototype._coordList = function (listSettings) {
        var i, j, ref, results;
        results = [];
        for (i = j = 0, ref = listSettings.steps; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            results.push(listSettings.start + (i * listSettings.stepSize));
        }
        return results;
    };

    LocationGrid.prototype.getLocation = function () {
        return this.freeCoords.pop();
    };

    return LocationGrid;

})();