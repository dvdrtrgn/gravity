/*jslint white:false */
/*globals require, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var W = ((W && W.window) || window), C = (W.C || W.console || {});

W.SHIET = {};
W.CF = {
    STEP_INTERVAL: 0.41, // 0.041 for 24 frames per seconds
    CANVAS_SEL: 'svg.canvas',
    _counter: 0,
    nextId: function () {
        return this._counter++;
    }
};

require.config({
    baseUrl: 'scripts/libs',
    paths: {
        src: '..',
        test: '../test',
        jquery: '/lib/jquery/1.8.2/jquery',
        uscore: '/lib/underscore/js-1.4.4/lodash.underscore'
    }
});

// Load the main app module to start the app
require(['src/bindings']);
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
