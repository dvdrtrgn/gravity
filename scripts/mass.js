/* global CN, Canvas, CF */

function wrapWithMassProperty(svgElement, massVal) {
    var ele = svgElement;
    var self = ele.Mass = {type: 'Mass'}
    var DISTANCE_SCALE_FACTOR = CN.EARTH_MOON_DISTANCE / CN.EARTH_MOON_SCREEN_DISTANCE;

    self.toBeRemoved = false;
    self.val = massVal;
    self.ax = 0;
    self.ay = 0;
    self.vx = 0;
    self.vy = 0;
    self.traceCounter = 0;

    function checkMass(obj) {
        if (obj.type !== 'Mass') throw new Error();
    }

    self._getX = function () {
        return parseFloat(ele.getAttribute('cx'));
    };

    self._getY = function () {
        return parseFloat(ele.getAttribute('cy'));
    };

    self._getRadius = function () {
        return parseFloat(ele.getAttribute('r'));
    };

    self._forceBetween = function (massiveObject) {
        checkMass(massiveObject);
        var squareDistance, force;

        squareDistance = this._squareDistanceFrom(massiveObject);
        force = CN.G * (this.val * massiveObject.val) / squareDistance;

        return -1 * force;
    };

    self._squareDistanceFrom = function (svgShape) {
        checkMass(svgShape);
        var xDiff, yDiff, squareDistance;

        xDiff = (this._getX() - svgShape._getX()) * DISTANCE_SCALE_FACTOR;
        yDiff = (this._getY() - svgShape._getY()) * DISTANCE_SCALE_FACTOR;
        squareDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

        return squareDistance;
    };

    self.addForce = function (massiveObject) {
        checkMass(massiveObject);
        var forceMagnitude, squareDistance, distance,
            xDiff, yDiff, xRatio, yRatio, fx, fy;

        forceMagnitude = this._forceBetween(massiveObject);
        squareDistance = this._squareDistanceFrom(massiveObject);
        distance = Math.sqrt(squareDistance);

        xDiff = (this._getX() - massiveObject._getX()) * DISTANCE_SCALE_FACTOR;
        yDiff = (this._getY() - massiveObject._getY()) * DISTANCE_SCALE_FACTOR;
        xRatio = xDiff / distance;
        yRatio = yDiff / distance;
        fx = forceMagnitude * xRatio;
        fy = forceMagnitude * yRatio;

        this.ax = this.ax + fx / this.val;
        this.ay = this.ay + fy / this.val;
    };

    self.updatePosition = function () {
        var nextX, nextY;

        this.vx = this.vx + this.ax * CF.STEP_INTERVAL;
        this.vy = this.vy + this.ay * CF.STEP_INTERVAL;

        nextX = this._getX() + (this.vx * CF.STEP_INTERVAL);
        nextY = this._getY() + (this.vy * CF.STEP_INTERVAL);

        ele.setAttribute('cx', nextX);
        ele.setAttribute('cy', nextY);

        this.ax = 0;
        this.ay = 0;
    };

    self.drawTrace = function () {
        var traceElement, x, y;

        if (++this.traceCounter % 20 === 0) {
            x = this._getX();
            y = this._getY();
            if (!trackTrace(x, y)) return;

            traceElement = Canvas.createRectangle('trace_' + nextId(), x, y, 1, 1, ele.getAttribute('fill'));
            traceElement.setAttribute('name', 'trace');
        }
    };

    self.overlaps = function (massiveObject) {
        checkMass(massiveObject);
        var squareDistance, a, b;

        squareDistance = this._squareDistanceFrom(massiveObject);
        a = this._getRadius() * DISTANCE_SCALE_FACTOR;
        b = massiveObject._getRadius() * DISTANCE_SCALE_FACTOR;

        return squareDistance <= Math.pow(a + b, 2);
    };
}

console.log('mass loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
