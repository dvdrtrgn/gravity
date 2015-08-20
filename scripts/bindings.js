/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* global Grav, Canvas */

var TRANSLATION_STEP = 50;

$('.btnEarthMass').click(Grav.setEarthMode);
$('.btnMoonMass').click(Grav.setMoonMode);
$('.btnJupiterMass').click(Grav.setJupiterMode);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('.btnUP').click(function () {
    Canvas.translate(0, TRANSLATION_STEP);
});
$('.btnLEFT').click(function () {
    Canvas.translate(TRANSLATION_STEP, 0);
});
$('.btnRIGHT').click(function () {
    Canvas.translate(-(TRANSLATION_STEP), 0);
});
$('.btnDOWN').click(function () {
    Canvas.translate(0, -(TRANSLATION_STEP));
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('#startButton').click(Grav.start);
$('#stopButton').click(Grav.stop);
$('#resetButton').click(Grav.reset);
$('#traceButton').click(Grav.toggleTraces);
$('#clearTraces').click(Grav.clearTraces);
$('#save').click(Grav.saveSpaceBodies);
$('#restore').click(Grav.restoreFromOutputArea);

Canvas.getSvgCanvas().onmousedown = function (e) {
    Grav.onSvgMouseDown(new MultiBrowserMouseEvent(e));
};

console.log('bindings loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
