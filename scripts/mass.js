/* global CN, Canvas, CF */

function wrapWithMassProperty(svgElement, massVal) {
    var ele = svgElement;
    var Scale = CN.EARTH_MOON_DISTANCE / CN.EARTH_MOON_SCREEN_DISTANCE;
    var Interval = CF.STEP_INTERVAL;
    var self = {
        type: 'Mass',
        toBeRemoved: false,
        val: massVal,
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
        traceCounter: 0,
        getX: function () {
            return parseFloat(ele.getAttribute('cx'));
        },
        getY: function () {
            return parseFloat(ele.getAttribute('cy'));
        },
        getRadius: function () {
            return parseFloat(ele.getAttribute('r'));
        },
    };

    function isMass(obj) {
        if (obj.type !== 'Mass') throw new Error();
    }

    self._forceBetween = function (mass) {
        isMass(mass);
        var sqDistance, force;

        sqDistance = this._sqDistanceFrom(mass);
        force = CN.G * (this.val * mass.val) / sqDistance;

        return -1 * force;
    };

    self._sqDistanceFrom = function (mass) {
        isMass(mass);
        var xDiff, yDiff, sqDistance;

        xDiff = (this.getX() - mass.getX()) * Scale;
        yDiff = (this.getY() - mass.getY()) * Scale;
        sqDistance = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);

        return sqDistance;
    };

    self.addForce = function (mass) {
        isMass(mass);
        var force, sqDistance, distance,
            xDiff, yDiff, xRatio, yRatio, fx, fy;

        force = this._forceBetween(mass);
        sqDistance = this._sqDistanceFrom(mass);
        distance = Math.sqrt(sqDistance);

        xDiff = (this.getX() - mass.getX()) * Scale;
        yDiff = (this.getY() - mass.getY()) * Scale;
        xRatio = xDiff / distance;
        yRatio = yDiff / distance;
        fx = force * xRatio;
        fy = force * yRatio;

        this.ax = this.ax + fx / this.val;
        this.ay = this.ay + fy / this.val;
    };

    self.updatePosition = function () {
        this.vx = this.vx + this.ax * Interval;
        this.vy = this.vy + this.ay * Interval;
        ele.setAttribute('cx', this.getX() + (this.vx * Interval));
        ele.setAttribute('cy', this.getY() + (this.vy * Interval));
        this.ax = 0;
        this.ay = 0;
    };

    self.drawTrace = function () {
        var track, x, y, fill, id;

        if (++this.traceCounter % 20 === 0) {
            x = this.getX();
            y = this.getY();
            if (W.trackTrace && !W.trackTrace(x, y)) {
                return;
            }
            fill = ele.getAttribute('fill');
            id = 'trace_' + nextId();

            track = Canvas.createRectangle(id, x, y, 1, 1, fill);
            track.setAttribute('name', 'trace');
        }
    };

    self.overlaps = function (mass) {
        isMass(mass);
        var sqDistance, a, b;

        sqDistance = this._sqDistanceFrom(mass);
        a = this.getRadius() * Scale;
        b = mass.getRadius() * Scale;

        return sqDistance <= Math.pow(a + b, 2);
    };

    return ele.Mass = self;
}

console.log('mass loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
