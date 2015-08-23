/* global CN, Canvas, CF */

function wrapWithMassProperty(svgElement, mass) {
    var self = svgElement;
    var Mass = self.Mass = {type: 'Mass'}
    var DISTANCE_SCALE_FACTOR = CN.EARTH_MOON_DISTANCE / CN.EARTH_MOON_SCREEN_DISTANCE;

    Mass.toBeRemoved = false;
    Mass.val = mass;
    Mass.ax = 0;
    Mass.ay = 0;
    Mass.vx = 0;
    Mass.vy = 0;
    Mass.traceCounter = 0;

    function checkMass(obj) {
        if (obj.type !== 'Mass') throw new Error();
    }

    Mass._getX = function () {
        return parseFloat(self.getAttribute('cx'));
    };

    Mass._getY = function () {
        return parseFloat(self.getAttribute('cy'));
    };

    Mass._getRadius = function () {
        return parseFloat(self.getAttribute('r'));
    };

    Mass._forceBetween = function (massiveObject) {
        checkMass(massiveObject);
        var squareDistance, force;

        squareDistance = this._squareDistanceFrom(massiveObject);
        force = CN.G * (this.val * massiveObject.val) / squareDistance;

        return -1 * force;
    };

    Mass._squareDistanceFrom = function (svgShape) {
        checkMass(svgShape);
        var xDiff, yDiff, squareDistance;

        xDiff = (this._getX() - svgShape._getX()) * DISTANCE_SCALE_FACTOR;
        yDiff = (this._getY() - svgShape._getY()) * DISTANCE_SCALE_FACTOR;
        squareDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

        return squareDistance;
    };

    Mass.addForce = function (massiveObject) {
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

    Mass.updatePosition = function () {
        var nextX, nextY;

        this.vx = this.vx + this.ax * CF.STEP_INTERVAL;
        this.vy = this.vy + this.ay * CF.STEP_INTERVAL;

        nextX = this._getX() + (this.vx * CF.STEP_INTERVAL);
        nextY = this._getY() + (this.vy * CF.STEP_INTERVAL);

        self.setAttribute('cx', nextX);
        self.setAttribute('cy', nextY);

        this.ax = 0;
        this.ay = 0;
    };

    Mass.drawTrace = function () {
        var traceElement, x, y;

        if (++this.traceCounter % 20 === 0) {
            x = this._getX();
            y = this._getY();
            if (!trackTrace(x, y)) return;

            traceElement = Canvas.createRectangle('trace_' + nextId(), x, y, 1, 1, self.getAttribute('fill'));
            traceElement.setAttribute('name', 'trace');
        }
    };

    Mass.overlaps = function (massiveObject) {
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
