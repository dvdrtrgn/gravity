/* global CF */

var Canvas = (function (canvasSel, transSel) {
    var self = {};
    var xmlhead = 'http://www.w3.org/2000/svg';

    self.init = function () {
        this.canvasEle = $(canvasSel)[0];
        this.transEle = $(transSel)[0];

        console.log('canvas inited', this);
        return this;
    };

    self.drawShape = function (shape) {
        this.transEle.appendChild(shape);
    };

    self.eraseShape = function (shape) {
        try {
            this.transEle.removeChild(shape);
        } catch (err) {
        }
    };

    self.translate = function (xAdjShift, yAdjShift, adjScale) {
        var x = this._trans.x += xAdjShift;
        var y = this._trans.y += yAdjShift;
        var z = (this._trans.z += (adjScale || 0));
        var arr = ['translate(', x, ', ', y, ') scale(', z, ')'];

        this.transEle.setAttribute('transform', arr.join(''));
    };

    self.getTranslation = function () {
        return {
            x: self._trans.x,
            y: self._trans.y,
            z: self._trans.z,
        };
    };

    self.resetTranslation = function () {
        this._trans.x = 0;
        this._trans.y = 0;
        this._trans.z = 1;

        this.transEle.setAttribute('transform', 'translate(0, 0) scale(1)');
    };

    self.serializeState = function () {
        var canvas = this.getSvgCanvas();

        canvas = $(canvas);
        $(canvas).find('[name="trace"]').remove();

        return canvas.get(0).outerHTML;
    };

    self._trans = new (
        function CanvasTranslation() {
            this.x = 0;
            this.y = 0;
            this.z = 1;
        }
    )();

    self.getSvgCanvas = function () {
        return this.canvasEle;
    };

    self.createCircle = function (id, cx, cy, radius, fill) {
        var ele = document.createElementNS(xmlhead, 'circle');

        $(ele).attr({
            fill: fill,
            id: id,
            r: radius,
            cx: cx,
            cy: cy,
        });

        this.drawShape(ele);
        return ele;
    };


    self.createRectangle = function (id, x, y, width, height, fill) {
        var ele = document.createElementNS(xmlhead, 'rect');

        $(ele).attr({
            fill: fill,
            height: height,
            id: id,
            x: x,
            y: y,
            width: width,
        });

        this.drawShape(ele);
        return ele;
    };

    return self.init();

}(CF.CANVAS_SEL, CF.TRANSFORM_SEL));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
