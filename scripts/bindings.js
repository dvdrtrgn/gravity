/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('.btnEarthMass').click(setEarthMode);
$('.btnMoonMass').click(setMoonMode);
$('.btnJupiterMass').click(setJupiterMode);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('.btnUP').click(function () {
    CanvasManager.translate(0, TRANSLATION_STEP);
});
$('.btnLEFT').click(function () {
    CanvasManager.translate(TRANSLATION_STEP, 0);
});
$('.btnRIGHT').click(function () {
    CanvasManager.translate(-(TRANSLATION_STEP), 0);
});
$('.btnDOWN').click(function () {
    CanvasManager.translate(0, -(TRANSLATION_STEP));
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$('#startButton').click(start);
$('#stopButton').click(stop);
$('#resetButton').click(reset);
$('#traceButton').click(toggleTraces);
$('#clearTraces').click(clearTraces)
$('#save').click(saveSpaceBodies);
$('#restore').click(restoreFromOutputArea);

console.log('bindings loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
