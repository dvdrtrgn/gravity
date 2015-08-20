/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* global Grav, Canvas */

(function Bind() {
    var TRANSLATION_STEP = 50;

    function up() {
        Canvas.translate(0, TRANSLATION_STEP);
    }
    function left() {
        Canvas.translate(TRANSLATION_STEP, 0);
    }
    function right() {
        Canvas.translate(-(TRANSLATION_STEP), 0);
    }
    function down() {
        Canvas.translate(0, -(TRANSLATION_STEP));
    }

    $('.btnEarthMass').click(Grav.setEarthMode);
    $('.btnMoonMass').click(Grav.setMoonMode);
    $('.btnJupiterMass').click(Grav.setJupiterMode);

    $('.btnUP').click(up);
    $('.btnLEFT').click(left);
    $('.btnRIGHT').click(right);
    $('.btnDOWN').click(down);

    $('body').keydown(function (evt) {
        switch (evt.keyCode) {
            case 38:
                return up();
            case 37:
                return left();
            case 39:
                return right();
            case 40:
                return down();
        }
    });

    $('.startButton').click(Grav.start);
    $('.stopButton').click(Grav.stop);
    $('.resetButton').click(Grav.reset);
    $('.traceButton').click(Grav.toggleTraces);
    $('.clearTraces').click(Grav.clearTraces);
    $('.save').click(Grav.saveSpaceBodies);
    $('.restore').click(Grav.restoreFromOutputArea);

    Canvas.getSvgCanvas().onmousedown = function (e) {
        Grav.onSvgMouseDown(new MultiBrowserMouseEvent(e));
    };

    console.log('bindings loaded');
}());
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
