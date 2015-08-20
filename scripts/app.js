/* global Canvas, CN, CF */

var Grav = (function () {
    var self;

    var SAVE_OUT_AREA_ID = 'saveOutputArea';
    var SPEED_SCALE_FACTOR = 1 / 200;
    var SVG_CIRCLE_WIDTH = 5;

    var running = false;
    var selectedColor = 'blue';
    var selectedMass = CN.EARTH_MASS;
    var shapes = [];
    var tracesActive = true;
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function initSvg() {
        console.log('Client Application initialization started...');
        return self;
    }

    function start() {
        if (running) {
            return;
        }
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

            if (me.toBeRemoved) {
                Canvas.eraseShape(me);
                shapes.splice(i, 1);
            } else {
                animateShapeFrame(me);
                me.updatePosition();

                if (tracesActive) {
                    me.drawTrace();
                }
            }
        }
        if (running) {
            setTimeout(gameLoop, CF.STEP_INTERVAL);
        }
    }

    function animateShapeFrame(shape) {
        var i, me;

        if (shape.toBeRemoved)
            return;

        for (i = 0; i < shapes.length; i++) {
            me = shapes[i];

            if (me.id !== shape.id) {
                if (shape.overlaps(me)) {
                    me.toBeRemoved = true;
                    shape.mass += me.mass;
                    shape.vx += me.vx / (shape.mass - me.mass);
                    shape.vy += me.vy / (shape.mass - me.mass);
                    continue;
                }
                shape.addForce(me);
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
        var x, y, circle;

        mouseEvent.translate(Canvas.currentTranslation);

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
        //
        Canvas.drawShape(lastVectorLine);
        Canvas.getSvgCanvas().onmouseup = function (event) {
            onMouseUpAdd(circle);
        };
    }

    function drawSpeedVector(mouseEvent) {
        mouseEvent.translate(Canvas.currentTranslation);
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
            spaceBodyInfos.push(new SpaceBodyInfo(this.id, this.mass, this.vx, this.vy));
            bodyIndex++;
        });

        script.innerHTML = JSON.stringify(spaceBodyInfos);
        textState += script.outerHTML;
        $('#' + SAVE_OUT_AREA_ID).val(textState);
    }

    function SpaceBodyInfo(id, mass, vx, vy) {
        this.id = id;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
    }

    function restoreFromOutputArea() {
        var text = $('#' + SAVE_OUT_AREA_ID).val();

        restoreState(text);
    }

    function restoreState(serializedAppState) {
        var restoreBox, circles, jsonString, infos;

        stop();
        reset();
        clearTraces();

        restoreBox = document.createElement('div');
        restoreBox = $(restoreBox);
        restoreBox.html(serializedAppState);
        circles = restoreBox.find('circle');

        $(circles).each(function () {
            Canvas.drawShape(this);
        });

        // TODO: restore gravitational properties
        jsonString = restoreBox.children('script').html();
        infos = JSON.parse(jsonString);
        $(infos).each(function () {
            var id = this.id;
            var svgShape = document.getElementById(id);

            wrapWithMassProperty(svgShape, this.mass);
            svgShape.vx = this.vx;
            svgShape.vy = this.vy;
            shapes.push(svgShape);
        });
    }

    self = {
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

    return initSvg();

})();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
 s = v * t; v expressed in m/s
 */
