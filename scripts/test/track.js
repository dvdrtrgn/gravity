/*global console */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

var trackTrace = (function () {
    var TT = {count: 0, clock: []};
    var num = TT.count++;

    function intfix(num, max) {
        max = max || 1e2;
        num = (num | 0) % max;
        return (num + max) % max;
    }

    function logTrace(delay) {
        if (delay) {
            window.clearTimeout(TT.clock[num]);
            TT.clock[num] = window.setTimeout(logTrace, delay);
            return;
        }
        console.log('logTrace', num, TT);
    }

    function trackTrace(x, y) {
        x = intfix(x);
        y = intfix(y);
        var key = 'xy' + x + '/' + y;

        if (TT[key]) {
            logTrace(999);
            return false;
        } else {
            TT[key] = true;
            return true;
        }
    }

    return trackTrace;

}());

console.log('track loaded');
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
