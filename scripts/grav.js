/* global Canvas, CN, CF */

var Grav = (function (Canvas, CN, CF) {
    var self;

    var SAVE_OUT_AREA_SEL = '.saveOutputArea';
    var RESTORE_SEL = '#Restore';
    var SPEED_SCALE_FACTOR = 1 / 200;
    var SVG_CIRCLE_WIDTH = 5;

    var running = false;
    var selectedColor = 'blue';
    var selectedMass = CN.EARTH_MASS;
    var shapes = [];
    var tracesActive = true;
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function initSvg() {
        self.SAVE_OUT_AREA = $(SAVE_OUT_AREA_SEL);
        self.RESTORE = $(RESTORE_SEL);

        console.log('grav inited', self);
        start();
        return self;
    }

    function start() {
        if (running)
            return;

        running = true;
        gameLoop(); // animateFrame();
    }

    function stop() {
        running = false;
    }

    function reset() {
        $(shapes).each(function () {
            Canvas.eraseShape(this);
        });
        shapes = new Array();
    }

    function clearTraces() {
        $('[name="trace"]').each(function () {
            Canvas.eraseShape(this);
        });
    }

    function gameLoop() {
        var i, me;

        for (i = 0; i < shapes.length; i++) {
            me = shapes[i];

            if (me.Mass.toBeRemoved) {
                Canvas.eraseShape(me);
                shapes.splice(i, 1);
            } else {
                animateShapeFrame(me);
                me.Mass.updatePosition();

                if (tracesActive) {
                    me.Mass.drawTrace();
                }
            }
        }
        if (running) {
            setTimeout(gameLoop, CF.STEP_INTERVAL);
        }
    }

    function animateShapeFrame(shape) {
        var i, me;

        if (shape.Mass.toBeRemoved)
            return;

        for (i = 0; i < shapes.length; i++) {
            me = shapes[i];

            if (me.id !== shape.id) {
                if (shape.Mass.overlaps(me.Mass)) {
                    me.Mass.toBeRemoved = true;
                    shape.Mass.val += me.Mass.val;
                    shape.Mass.vx += me.Mass.vx / (shape.Mass.val - me.Mass.val);
                    shape.Mass.vy += me.Mass.vy / (shape.Mass.val - me.Mass.val);
                    continue;
                }
                shape.Mass.addForce(me.Mass);
            }
        }
    }

    function createCircle(circleId, centerX, centerY, radius, color) {
        var element = Canvas.createCircle(circleId, centerX, centerY, radius, color);

        wrapWithMassProperty(element, selectedMass);
        Canvas.drawShape(element);

        return element;
    }

    function onSvgMouseDown(mouseEvent) {
        var x, y, circle, canvas;

        mouseEvent.translate(Canvas.getTranslation());

        x = mouseEvent.getX();
        y = mouseEvent.getY();
        circle = createCircle('circle_' + nextId(), x, y, SVG_CIRCLE_WIDTH, selectedColor);


        Canvas.getSvgCanvas().onmousemove = function (event) {
            drawSpeedVector(new MultiBrowserMouseEvent(event));
        };

        // creates a line
        lastVectorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lastVectorLine.setAttribute('x1', mouseEvent.getX());
        lastVectorLine.setAttribute('y1', mouseEvent.getY());
        lastVectorLine.setAttribute('x2', mouseEvent.getX());
        lastVectorLine.setAttribute('y2', mouseEvent.getY());
        lastVectorLine.setAttribute('style', 'stroke:rgb(255,0,0);stroke-width:1');
        Canvas.drawShape(lastVectorLine);
        //
        canvas = Canvas.getSvgCanvas();
        canvas.onmouseleave = //
            canvas.onmouseup = function () {
                onMouseUpAdd(circle);
            };
    }

    function drawSpeedVector(mouseEvent) {
        mouseEvent.translate(Canvas.getTranslation());
        lastVectorLine.setAttribute('x2', mouseEvent.getX());
        lastVectorLine.setAttribute('y2', mouseEvent.getY());
    }

    function onMouseUpAdd(circle) {
        var graphicXDiff, graphicYDiff;

        // gets the length of the graphic vector and computer the corresponding speed:
        graphicXDiff = parseFloat(lastVectorLine.getAttribute('x2')) - parseFloat(lastVectorLine.getAttribute('x1'));
        graphicYDiff = parseFloat(lastVectorLine.getAttribute('y2')) - parseFloat(lastVectorLine.getAttribute('y1'));

        // the speed components are proportional to the graphic components
        circle.vx = graphicXDiff * SPEED_SCALE_FACTOR;
        circle.vy = graphicYDiff * SPEED_SCALE_FACTOR;

        shapes.push(circle);
        Canvas.eraseShape(lastVectorLine);
        Canvas.getSvgCanvas().onmousemove = function (e) {
            // huh
        };
        console.log('END');
    }

    function setMoonMode() {
        selectedColor = 'grey';
        selectedMass = CN.MOON_MASS;
    }

    function setEarthMode() {
        selectedColor = 'blue';
        selectedMass = CN.EARTH_MASS;
    }

    function setJupiterMode() {
        selectedColor = 'maroon';
        selectedMass = CN.JUPITER_MASS;
    }

    function toggleTraces() {
        tracesActive = !tracesActive;
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function saveSpaceBodies() {
        var textState, script, spaceBodyInfos, bodyIndex;

        textState = Canvas.serializeState();

        script = document.createElement('script');
        spaceBodyInfos = new Array();
        bodyIndex = 0;

        $(shapes).select('[id*="circle"]').each(function () {
            spaceBodyInfos.push(new SpaceBodyInfo(this.id, this.Mass.val, this.Mass.vx, this.Mass.vy));
            bodyIndex++;
        });

        script.innerHTML = JSON.stringify(spaceBodyInfos);
        textState += script.outerHTML;
        self.SAVE_OUT_AREA.val(textState);
    }

    function SpaceBodyInfo(id, mass, vx, vy) {
        this.id = id;
        this.Mass.val = mass;
        this.Mass.vx = vx;
        this.Mass.vy = vy;
    }

    function restoreFromOutputArea() {
        var text = self.SAVE_OUT_AREA.val();

        restoreState(text);
    }

    function restoreState(serializedAppState) {
        var circles, jsonString, infos;

        reset();
        clearTraces();

        self.RESTORE[0].innerHTML = serializedAppState;
        circles = self.RESTORE.find('circle');

        $(circles).each(function () {
            Canvas.drawShape(this);
        });

        // TODO: restore gravitational properties
        jsonString = self.RESTORE.children('script');
        infos = JSON.parse(jsonString.html());
        $(infos).each(function () {
            var id = this.id;
            var svgShape = document.getElementById(id);

            wrapWithMassProperty(svgShape, this.Mass.val);
            svgShape.Mass.vx = this.Mass.vx;
            svgShape.Mass.vy = this.Mass.vy;
            shapes.push(svgShape);
        });
    }

    self = {
        init: initSvg,
        setEarthMode: setEarthMode,
        setMoonMode: setMoonMode,
        setJupiterMode: setJupiterMode,
        start: start,
        stop: stop,
        reset: reset,
        toggleTraces: toggleTraces,
        clearTraces: clearTraces,
        saveSpaceBodies: saveSpaceBodies,
        restoreFromOutputArea: restoreFromOutputArea,
        onSvgMouseDown: onSvgMouseDown,
    };

    return self.init();

}(Canvas, CN, CF));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
 s = v * t; v expressed in m/s
 */
