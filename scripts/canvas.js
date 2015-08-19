function CanvasManager() {
    // host
}

CanvasManager.drawShape = function (shape) {
    document.getElementById(TRANSFORM_ID).appendChild(shape);
};

CanvasManager.eraseShape = function (shape) {
    document.getElementById(TRANSFORM_ID).removeChild(shape);
};

CanvasManager.translate = function (xAdditionalShift, yAdditionalShift) {
    this.currentTranslation.x += xAdditionalShift;
    this.currentTranslation.y += yAdditionalShift;
    var transform = document.getElementById(TRANSFORM_ID);
    transform.setAttribute('transform', 'translate(' + this.currentTranslation.x + ', ' + this.currentTranslation.y + ')');
};

CanvasManager.resetTranslation = function () {
    this.currentTranslation.x = 0;
    this.currentTranslation.y = 0;
    var transform = document.getElementById(TRANSFORM_ID);
    transform.setAttribute('transform', 'translate(0, 0)');
};

CanvasManager.serializeState = function () {
    var canvas = getSvgCanvas();
    canvas = $(canvas);
    $(canvas).find('[name="trace"]').remove();
    return canvas.parent().html();
};

CanvasManager.currentTranslation = new (
    function CanvasTranslation() {
        this.x = 0;
        this.y = 0;
    }
)();

console.log('canvas loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
