/*global console, define*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
define(['canvas'], function (Canvas) {
    'use strict';

    var CN = {
        G: 6.673E-11,
        EARTH_MASS: 5.972E+24,
        MOON_MASS: 7.348E+22,
        JUPITER_MASS: 1.8986E+27,
        EARTH_MOON_DISTANCE: 384400000, //384,400 Km
        EARTH_MOON_SCREEN_DISTANCE: 50,
        MultiBrowserMouseEvent: function (innerEvent) {
            /* global Canvas */
            this.innerEvent = innerEvent;
            this.xTranslation = 0;
            this.yTranslation = 0;

            this.getX = function () {
                var notTranslated;

                notTranslated = this.innerEvent.offsetX ? this.innerEvent.offsetX :
                    this.innerEvent.clientX - Canvas.getSvgCanvas().getBoundingClientRect().left;

                return notTranslated - this.xTranslation;
            };

            this.getY = function () {
                var notTranslated;

                notTranslated = this.innerEvent.offsetY ? this.innerEvent.offsetY :
                    this.innerEvent.clientY - Canvas.getSvgCanvas().getBoundingClientRect().top;

                return notTranslated - this.yTranslation;
            };

            this.translate = function (translation) {
                this.xTranslation = translation.x;
                this.yTranslation = translation.y;
            };
        }
    };
    console.log('common loaded');
    return CN;
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
