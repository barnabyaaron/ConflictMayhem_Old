define([
        'jsbezier'
    ], function (jsBezier) {
    return (function() {
        function BezierPath() { }

        BezierPath.prototype.scalePoints = function(points, arg) {
            var i, j, len, o, origin, p, results, scale;
            origin = arg.origin, scale = arg.scale;
            o = {
                x: (points[0].x * scale.x) - origin.x,
                y: (points[0].y * scale.y) - origin.y
            };
            results = [];
            for (i = j = 0, len = points.length; j < len; i = ++j) {
                p = points[i];
                results.push({
                    x: (p.x * scale.x) - o.x,
                    y: (p.y * scale.y) - o.y
                });
            }
            return results;
        };

        BezierPath.prototype.buildPathFrom = function(points) {
            var a, b, c1, c2, curveDistance, curvePoints, dx, dy, firstControlPoints, i, j, k, pc, pn, ref, ref1, ref2, ref3, result, samplePoints, secondControlPoints, step;
            result = {
                distance: 0,
                curves: []
            };
            ref = this.getCurveControlPoints(points), firstControlPoints = ref[0], secondControlPoints = ref[1];
            samplePoints = 3;
            for (i = j = 0, ref1 = points.length - 1; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
                a = points[i];
                b = points[i + 1];
                c1 = firstControlPoints[i];
                c2 = secondControlPoints[i];
                curvePoints = [b, c2, c1, a];
                curveDistance = 0;
                pc = jsBezier.pointOnCurve(curvePoints, 0);
                step = 1 / samplePoints;
                for (i = k = ref2 = step, ref3 = step; ref3 > 0 ? k <= 1 : k >= 1; i = k += ref3) {
                    pn = jsBezier.pointOnCurve(curvePoints, i);
                    dx = Math.abs(pc.x - pn.x);
                    dy = Math.abs(pc.y - pn.y);
                    curveDistance += Math.sqrt((Math.pow(dx, 2)) + (Math.pow(dy, 2)));
                    pc = pn;
                }
                result.distance += curveDistance;
                result.curves.push({
                    distance: curveDistance,
                    points: curvePoints
                });
            }
            return result;
        };

        BezierPath.prototype.pointOnPath = function(path, location) {
            var ci, curve, p, ref, v;
            ref = this.getCurveAndLocation(path, location), curve = ref[0], v = ref[1], ci = ref[2];
            p = jsBezier.pointOnCurve(curve.points, v);
            p.c = ci;
            return p;
        };

        BezierPath.prototype.angleOnPath = function (path, location) {
            var angle, p1, p2;
            p1 = this.pointOnPath(path, Math.min(location, 0.99));
            p2 = this.pointOnPath(path, Math.min(location + 0.01, 1.0));
            angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);
            angle *= 180 / Math.PI;
            return (angle + 360) % 360;
        };

        BezierPath.prototype.getCurveAndLocation = function (path, location) {
            var currentCurve, curve, distance, partDistance, pastDistance, relDistance, v;
            distance = 0.0;
            currentCurve = 0;
            curve = path.curves[currentCurve];
            relDistance = (distance + curve.distance) / path.distance;
            while (location > relDistance) {
                currentCurve += 1;
                distance += curve.distance;
                curve = path.curves[currentCurve];
                relDistance = (distance + curve.distance) / path.distance;
            }
            partDistance = curve.distance / path.distance;
            pastDistance = distance / path.distance;
            v = (location - pastDistance) / partDistance;
            return [curve, v, currentCurve];
        };

        BezierPath.prototype.getCurveControlPoints = function (points) {
            var firstControlPoints, i, j, n, ref, rhs, secondControlPoints, x, y;
            n = points.length - 1;
            if (n < 1) {
                return [];
            }
            if (n === 1) {
                firstControlPoints = [
                  {
                      x: (2.0 * points[0].x + points[1].x) / 3.0,
                      y: (2.0 * points[0].y + points[1].y) / 3.0
                  }
                ];
                secondControlPoints = [
                  {
                      x: 2.0 * firstControlPoints[0].x - points[0].x,
                      y: 2.0 * firstControlPoints[0].y - points[0].y
                  }
                ];
                return [firstControlPoints, secondControlPoints];
            }
            rhs = (function () {
                var j, ref, results;
                results = [];
                for (i = j = 1, ref = n - 1; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
                    results.push(4.0 * points[i].x + 2.0 * points[i + 1].x);
                }
                return results;
            })();
            rhs.unshift(points[0].x + 2.0 * points[1].x);
            rhs.push((8.0 * points[n - 1].x + points[n].x) / 2.0);
            x = this.getFirstControlPoints(rhs);
            rhs = (function () {
                var j, ref, results;
                results = [];
                for (i = j = 1, ref = n - 1; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
                    results.push(4.0 * points[i].y + 2.0 * points[i + 1].y);
                }
                return results;
            })();
            rhs.unshift(points[0].y + 2.0 * points[1].y);
            rhs.push((8.0 * points[n - 1].y + points[n].y) / 2.0);
            y = this.getFirstControlPoints(rhs);
            firstControlPoints = [];
            secondControlPoints = [];
            for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                firstControlPoints.push({
                    x: x[i],
                    y: y[i]
                });
                if (i < n - 1) {
                    secondControlPoints.push({
                        x: 2.0 * points[i + 1].x - x[i + 1],
                        y: 2.0 * points[i + 1].y - y[i + 1]
                    });
                } else {
                    secondControlPoints.push({
                        x: (points[n].x + x[n - 1]) / 2.0,
                        y: (points[n].y + y[n - 1]) / 2.0
                    });
                }
            }
            return [firstControlPoints, secondControlPoints];
        };

        BezierPath.prototype.getFirstControlPoints = function (rhs) {
            var b, i, j, k, n, ref, ref1, tmp, x;
            n = rhs.length;
            x = [];
            tmp = [null];
            b = 2.0;
            x.push(rhs[0] / b);
            for (i = j = 1, ref = n; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
                tmp.push(1 / b);
                b = i < n - 1 ? 4.0 : 3.5;
                b -= tmp[i];
                x.push((rhs[i] - x[i - 1]) / b);
            }
            for (i = k = 1, ref1 = n; 1 <= ref1 ? k < ref1 : k > ref1; i = 1 <= ref1 ? ++k : --k) {
                x[n - i - 1] -= tmp[n - i] * x[n - i];
            }
            return x;
        };

        return BezierPath;
    })();
});