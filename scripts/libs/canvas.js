/*global define, console, CF */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
define(['jquery'], function ($) {
    'use strict';

    var _, self = {};
    var svgSel = CF.CANVAS_SEL;
    var xmlhead = 'http://www.w3.org/2000/svg';
    var canvasEle, transEle, transObj;

    function CanvasTranslation() {
        this.x = 0;
        this.y = 0;
        this.z = 1;
    }

    self.drawShape = function (shape) {
        transEle.appendChild(shape);
    };

    self.eraseShape = function (shape) {
        try {
            transEle.removeChild(shape);
        } catch (err) {
        }
    };

    self.translate = function (xAdjShift, yAdjShift, adjScale) {
        var arr, x, y, z;

        x = transObj.x += xAdjShift;
        y = transObj.y += yAdjShift;
        z = transObj.z += (adjScale || 0);
        arr = ['translate(', x, ', ', y, ') scale(', z, ')'];

        transEle.setAttribute('transform', arr.join(''));
    };

    self.getTranslation = function () {
        return {
            x: transObj.x,
            y: transObj.y,
            z: transObj.z
        };
    };

    self.resetTranslation = function () {
        transEle.setAttribute('transform', 'translate(0, 0) scale(1)');
        return (transObj = new CanvasTranslation());
    };

    self.serializeState = function () {
        $(canvasEle).find('[name="trace"]').remove();
        return canvasEle.outerHTML;
    };

    self.getSvgCanvas = function () {
        return canvasEle;
    };

    self.createCircle = function (id, cx, cy, radius, fill) {
        var ele = document.createElementNS(xmlhead, 'circle');

        $(ele).attr({
            fill: fill,
            id: id,
            r: radius,
            cx: cx,
            cy: cy
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
            width: width
        });
        this.drawShape(ele);
        return ele;
    };

    function init() {
        _ = self._ = {
            canvasEle: canvasEle = $(svgSel)[0],
            transEle: transEle = document.createElementNS(xmlhead, 'g'),
            transObj: self.resetTranslation()
        };
        canvasEle.appendChild(transEle);
        console.log('Canvas inited', self);
        return self;
    }
    return init();
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
