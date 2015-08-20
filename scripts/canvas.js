var TRANSFORM_ID = 'canvasTranslation';
var Canvas = (function () {
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
        var transform = document.getElementById(TRANSFORM_ID);

        this.currentTranslation.x += xAdditionalShift;
        this.currentTranslation.y += yAdditionalShift;

        transform.setAttribute('transform', 'translate(' + this.currentTranslation.x + ', ' + this.currentTranslation.y + ')');
    };

    self.resetTranslation = function () {
        var transform = document.getElementById(TRANSFORM_ID);

        this.currentTranslation.x = 0;
        this.currentTranslation.y = 0;

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

    self.createCircle = function(circleId, centerX, centerY, radius, color) {
        var element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        element.setAttribute('id', circleId);
        element.setAttribute('cx', centerX);
        element.setAttribute('cy', centerY);
        element.setAttribute('r', radius);
        element.setAttribute('fill', color);

        this.drawShape(element);
        return element;
    };


    self.createRectangle = function (id, x, y, width, height, fill) {
        var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        rectElement.setAttribute('x', x);
        rectElement.setAttribute('y', y);
        rectElement.setAttribute('width', width);
        rectElement.setAttribute('height', height);
        rectElement.setAttribute('fill', fill);
        rectElement.setAttribute('id', id);

        this.drawShape(rectElement);
        return rectElement;
    };

    return self;
})();

console.log('canvas loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
