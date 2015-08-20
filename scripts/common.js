/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* global Canvas */

var CN = {
    G: 6.673E-11,
    EARTH_MASS: 5.972E+24,
    MOON_MASS: 7.348E+22,
    JUPITER_MASS: 1.8986E+27,
    EARTH_MOON_DISTANCE: 384400000, //384,400 Km
    EARTH_MOON_SCREEN_DISTANCE: 50,
};

var DISTANCE_SCALE_FACTOR = CN.EARTH_MOON_DISTANCE / CN.EARTH_MOON_SCREEN_DISTANCE;
var STEP_INTERVAL = 0.41; // 0.041 for 24 frames per seconds

var traceCounter = 0;
var idCounter = 0;

function nextId() {
    idCounter++;
    return idCounter;
}

function MultiBrowserMouseEvent(innerEvent) {
    this.innerEvent = innerEvent;
    this.xTranslation = 0;
    this.yTranslation = 0;

    this.getX = function () {
        var notTranslated;

        notTranslated = this.innerEvent.offsetX ? this.innerEvent.offsetX :
            this.innerEvent.clientX - Canvas.getSvgCanvas().getBoundingClientRect().left;

        return notTranslated - this.xTranslation;
    };

    this.getY = function () {
        var notTranslated;

        notTranslated = this.innerEvent.offsetY ? this.innerEvent.offsetY :
            this.innerEvent.clientY - Canvas.getSvgCanvas().getBoundingClientRect().top;

        return notTranslated - this.yTranslation;
    };

    this.translate = function (translation) {
        this.xTranslation = translation.x;
        this.yTranslation = translation.y;
    };
}

function wrapWithMassProperty(svgElement, mass) {
    svgElement.toBeRemoved = false;
    svgElement.mass = mass;
    svgElement.ax = 0;
    svgElement.ay = 0;
    svgElement.vx = 0;
    svgElement.vy = 0;
    svgElement.traceCounter = 0;

    svgElement.getX = function () {
        return parseFloat(this.getAttribute('cx'));
    };

    svgElement.getY = function () {
        return parseFloat(this.getAttribute('cy'));
    };

    svgElement.getRadius = function () {
        return parseFloat(this.getAttribute('r'));
    };

    svgElement.forceBetween = function (massiveObject) {
        var squareDistance, force;

        squareDistance = this.squareDistanceFrom(massiveObject);
        force = CN.G * (this.mass * massiveObject.mass) / squareDistance;

        return -1 * force;
    };

    svgElement.squareDistanceFrom = function (svgShape) {
        var xDiff, yDiff, squareDistance;

        xDiff = (this.getX() - svgShape.getX()) * DISTANCE_SCALE_FACTOR;
        yDiff = (this.getY() - svgShape.getY()) * DISTANCE_SCALE_FACTOR;
        squareDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

        return squareDistance;
    };

    svgElement.addForce = function (massiveObject) {
        var forceMagnitude, squareDistance, distance,
            xDiff, yDiff, xRatio, yRatio, fx, fy;

        forceMagnitude = this.forceBetween(massiveObject);
        squareDistance = this.squareDistanceFrom(massiveObject);
        distance = Math.sqrt(squareDistance);

        xDiff = (this.getX() - massiveObject.getX()) * DISTANCE_SCALE_FACTOR;
        yDiff = (this.getY() - massiveObject.getY()) * DISTANCE_SCALE_FACTOR;
        xRatio = xDiff / distance;
        yRatio = yDiff / distance;
        fx = forceMagnitude * xRatio;
        fy = forceMagnitude * yRatio;

        this.ax = this.ax + fx / this.mass;
        this.ay = this.ay + fy / this.mass;
    };

    svgElement.updatePosition = function () {
        var nextX, nextY;

        this.vx = this.vx + this.ax * STEP_INTERVAL;
        this.vy = this.vy + this.ay * STEP_INTERVAL;

        nextX = this.getX() + (this.vx * STEP_INTERVAL);
        nextY = this.getY() + (this.vy * STEP_INTERVAL);

        this.setAttribute('cx', nextX);
        this.setAttribute('cy', nextY);

        this.ax = 0;
        this.ay = 0;
    };

    svgElement.drawTrace = function () {
        var traceElement, x, y;

        x = this.getX();
        y = this.getY();

        if (++this.traceCounter % 20 === 0) {
            traceElement = Canvas.createRectangle('trace_' + nextId(), x, y, 1, 1, this.getAttribute('fill'));
            traceElement.setAttribute('name', 'trace');
        }
    };

    svgElement.overlaps = function (massiveObject) {
        var squareDistance, a, b;

        squareDistance = this.squareDistanceFrom(massiveObject);
        a = this.getRadius() * DISTANCE_SCALE_FACTOR;
        b = massiveObject.getRadius() * DISTANCE_SCALE_FACTOR;

        return squareDistance <= Math.pow(a + b, 2);
    };
}
console.log('common loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
