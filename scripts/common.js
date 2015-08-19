/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*

    improvements
        mass
            make radius reflect mass
            display mass quotients
        enable keyboard
            arrows (translate NSEW)
            zoom out/in (Z / z)
            speed up/down (S / s)
        start with
            tracings
            unpaused


    refactor
        use reqAF
        use closures

        make config an object
        make global an object

        bind buttons dynamically

    fix
        drag out of bounds freezes new mass

    figure out
        text fields
        collision handling

    consider
        make trace a path (instead of thousands of rects)

 */

/* global getSvgCanvas, CanvasManager */

var G = 6.673E-11;
var EARTH_MASS = 5.972E+24;
var MOON_MASS = 7.348E+22;
var JUPITER_MASS = 1.8986E+27;
var EARTH_MOON_DISTANCE = 384400000; //384,400 Km

var EARTH_MOON_SCREEN_DISTANCE = 50;

var DISTANCE_SCALE_FACTOR = EARTH_MOON_DISTANCE / EARTH_MOON_SCREEN_DISTANCE;

var STEP_INTERVAL = 0.41; // 0.041 for 24 frames per seconds

var VX_DEFAULT = 0;
var VY_DEFAULT = 0;

var traceCounter = 0;
var TRANSFORM_ID = 'canvasTranslation';

function createRectangle(id, x, y, width, height, fill) {
    var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectElement.setAttribute('x', x);
    rectElement.setAttribute('y', y);
    rectElement.setAttribute('width', width);
    rectElement.setAttribute('height', height);
    rectElement.setAttribute('fill', fill);
    rectElement.setAttribute('id', id);
    CanvasManager.drawShape(rectElement);
    return rectElement;
}

function MultiBrowserMouseEvent(innerEvent) {
    this.innerEvent = innerEvent;

    this.xTranslation = 0;
    this.yTranslation = 0;

    this.getX = function () {
        var notTranslated = this.innerEvent.offsetX ? this.innerEvent.offsetX : this.innerEvent.clientX - getSvgCanvas().getBoundingClientRect().left;
        return notTranslated - this.xTranslation;
    };

    this.getY = function () {
        var notTranslated = this.innerEvent.offsetY ? this.innerEvent.offsetY : this.innerEvent.clientY - getSvgCanvas().getBoundingClientRect().top;
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
        var squareDistance = this.squareDistanceFrom(massiveObject);
        var force = G * (this.mass * massiveObject.mass) / squareDistance;

        return -1 * force;
    };

    svgElement.squareDistanceFrom = function (svgShape) {
        var xDiff = (this.getX() - svgShape.getX()) * DISTANCE_SCALE_FACTOR;
        var yDiff = (this.getY() - svgShape.getY()) * DISTANCE_SCALE_FACTOR;
        var squareDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

        return squareDistance;
    };

    svgElement.addForce = function (massiveObject) {
        var forceMagnitude = this.forceBetween(massiveObject);
        var squareDistance = this.squareDistanceFrom(massiveObject);
        var distance = Math.sqrt(squareDistance);

        var xDiff = (this.getX() - massiveObject.getX()) * DISTANCE_SCALE_FACTOR;
        var yDiff = (this.getY() - massiveObject.getY()) * DISTANCE_SCALE_FACTOR;

        var xRatio = xDiff / distance;
        var yRatio = yDiff / distance;

        var fx = forceMagnitude * xRatio;
        var fy = forceMagnitude * yRatio;

        this.ax = this.ax + fx / this.mass;
        this.ay = this.ay + fy / this.mass;
    };

    svgElement.updatePosition = function () {
        this.vx = this.vx + this.ax * STEP_INTERVAL;
        this.vy = this.vy + this.ay * STEP_INTERVAL;

        var nextX = this.getX() + (this.vx * STEP_INTERVAL);// + (1/2 * this.ax * STEP_INTERVAL * STEP_INTERVAL);
        var nextY = this.getY() + (this.vy * STEP_INTERVAL);// + (1/2 * this.ay * STEP_INTERVAL * STEP_INTERVAL);

//      var nextX = this.getX() + (1/2 * this.ax * STEP_INTERVAL * STEP_INTERVAL);
//      var nextY = this.getY() + (1/2 * this.ay * STEP_INTERVAL * STEP_INTERVAL);

//      console.log("new position: (" + nextX + ", " + nextY + ")");

        this.setAttribute('cx', nextX);
        this.setAttribute('cy', nextY);

        this.ax = 0;
        this.ay = 0;
    };

    svgElement.drawTrace = function () {
        if (++this.traceCounter % 20 === 0) {
//          var traceElement = createCircle("trace_" + nextId(), this.getX(), this.getY(), .5, this.getAttribute('fill'));
            var traceElement = createRectangle("trace_" + nextId(), this.getX(), this.getY(), 1, 1, this.getAttribute('fill'));
//          var traceElement = createLine(this.getX(), this.getY(), this.getX(), this.getY());
            traceElement.setAttribute('name', 'trace');
        }
    };

    svgElement.overlaps = function (massiveObject) {
        var squareDistance = this.squareDistanceFrom(massiveObject);
        return squareDistance <= Math.pow(this.getRadius() * DISTANCE_SCALE_FACTOR + massiveObject.getRadius() * DISTANCE_SCALE_FACTOR, 2);
    };
}
console.log('common loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
