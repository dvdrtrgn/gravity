/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* global Grav, Canvas */

(function Bind() {
    var TRANSLATION_STEP = 50;

    function up() {
        Canvas.translate(0, TRANSLATION_STEP);
    }
    function left() {
        Canvas.translate(TRANSLATION_STEP, 0);
    }
    function right() {
        Canvas.translate(-(TRANSLATION_STEP), 0);
    }
    function down() {
        Canvas.translate(0, -(TRANSLATION_STEP));
    }
    function activate(ele, klass) {
        $(klass).removeClass('active');
        $(ele).addClass('active');
    }
    function toggle(ele, klass) {
        var me = $(ele);

        if (me.is('.' + klass)) {
            me.removeClass(klass);
            return false;
        } else {
            me.addClass(klass);
            return true;
        }
    }

    $('.btn.earth.mass').click(function () {
        Grav.setEarthMode();
        activate(this, '.btn.mass');
    });
    $('.btn.moon.mass').click(function () {
        Grav.setMoonMode();
        activate(this, '.btn.mass');
    });
    $('.btn.jupiter.mass').click(function () {
        Grav.setJupiterMode();
        activate(this, '.btn.mass');
    });

    $('.btn.up').click(up);
    $('.btn.left').click(left);
    $('.btn.right').click(right);
    $('.btn.down').click(down);

    $('body').keydown(function (evt) {
        switch (evt.keyCode) {
            case 38:
                return up();
            case 37:
                return left();
            case 39:
                return right();
            case 40:
                return down();
        }
    });

    $('.start.btn').click(function () {
        toggle(this, 'active') ? Grav.start() : Grav.stop();
    });

    $('.trace.btn').click(function () {
        toggle(this, 'active');
        Grav.toggleTraces();
    });
    $('.cleartraces.btn').click(Grav.clearTraces);

    $('.save.btn').click(Grav.saveSpaceBodies);
    $('.restore.btn').click(Grav.restoreFromOutputArea);
    $('.reset.btn').click(Grav.reset);

    Canvas.getSvgCanvas().onmousedown = function (e) {
        Grav.onSvgMouseDown(new MultiBrowserMouseEvent(e));
    };

    console.log('bindings loaded');
}());
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
