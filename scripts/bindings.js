/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* global Grav */

var TRANSLATION_STEP = 50;

$('.btnEarthMass').click(Grav.setEarthMode);
$('.btnMoonMass').click(Grav.setMoonMode);
$('.btnJupiterMass').click(Grav.setJupiterMode);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('.btnUP').click(function () {
    Grav.CanvasManager.translate(0, TRANSLATION_STEP);
});
$('.btnLEFT').click(function () {
    Grav.CanvasManager.translate(TRANSLATION_STEP, 0);
});
$('.btnRIGHT').click(function () {
    Grav.CanvasManager.translate(-(TRANSLATION_STEP), 0);
});
$('.btnDOWN').click(function () {
    Grav.CanvasManager.translate(0, -(TRANSLATION_STEP));
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('#startButton').click(Grav.start);
$('#stopButton').click(Grav.stop);
$('#resetButton').click(Grav.reset);
$('#traceButton').click(Grav.toggleTraces);
$('#clearTraces').click(Grav.clearTraces);
$('#save').click(Grav.saveSpaceBodies);
$('#restore').click(Grav.restoreFromOutputArea);

Grav.getSvgCanvas().onmousedown = function (e) {
    Grav.onSvgMouseDown(new MultiBrowserMouseEvent(e));
};

console.log('bindings loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
