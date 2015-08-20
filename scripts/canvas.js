/* global CF */

var Canvas = (function (canvaSel, transSel) {
    function self() {
        // host
    }
    self.init = function () {
        this.CANVAS = $(canvaSel)[0];
        this.TRANSFORM = $(transSel)[0];
        console.log('canvas loaded', this);
        return this;
    };

    self.drawShape = function (shape) {
        this.TRANSFORM.appendChild(shape);
    };

    self.eraseShape = function (shape) {
        try {
            this.TRANSFORM.removeChild(shape);
        } catch (err) {
        }
    };

    self.translate = function (xAdditionalShift, yAdditionalShift) {
        this.currentTranslation.x += xAdditionalShift;
        this.currentTranslation.y += yAdditionalShift;

        this.TRANSFORM.setAttribute('transform', 'translate(' + this.currentTranslation.x + ', ' + this.currentTranslation.y + ')');
    };

    self.resetTranslation = function () {
        this.currentTranslation.x = 0;
        this.currentTranslation.y = 0;

        this.TRANSFORM.setAttribute('transform', 'translate(0, 0)');
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
        return this.CANVAS;
    };

    self.createCircle = function (circleId, centerX, centerY, radius, color) {
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

    return self.init();

}(CF.CANVAS_SEL, CF.TRANSFORM_SEL));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
