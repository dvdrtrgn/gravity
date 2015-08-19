var TRANSFORM_ID = 'canvasTranslation';
var CanvasManager = (function () {
    function self() {
        // host
    }
    self.drawShape = function (shape) {
        document.getElementById(TRANSFORM_ID).appendChild(shape);
    };

    self.eraseShape = function (shape) {
        document.getElementById(TRANSFORM_ID).removeChild(shape);
    };

    self.translate = function (xAdditionalShift, yAdditionalShift) {
        this.currentTranslation.x += xAdditionalShift;
        this.currentTranslation.y += yAdditionalShift;
        var transform = document.getElementById(TRANSFORM_ID);
        transform.setAttribute('transform', 'translate(' + this.currentTranslation.x + ', ' + this.currentTranslation.y + ')');
    };

    self.resetTranslation = function () {
        this.currentTranslation.x = 0;
        this.currentTranslation.y = 0;
        var transform = document.getElementById(TRANSFORM_ID);
        transform.setAttribute('transform', 'translate(0, 0)');
    };

    self.serializeState = function () {
        var canvas = this.getSvgCanvas();
        canvas = $(canvas);
        $(canvas).find('[name="trace"]').remove();
        return canvas.parent().html();
    };

    self.currentTranslation = new (
        function CanvasTranslation() {
            this.x = 0;
            this.y = 0;
        }
    )();

    self.getSvgCanvas = function () {
        return document.getElementById('svgCanvas');
    };

    return self;
})();

console.log('canvas loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
