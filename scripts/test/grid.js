/*global console, define*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
define([], function () {

    var GG = (function () {

        function Point() {
            this.name = this.toString();
        }
        function Vector(nom) {
            var v = [];
            if (nom) {
                v.name = nom;
            }
            return v;
        }
        function Grid(x, y) {
            this.cols = x || new Vector();
            this.rows = y || new Vector();
        }

        Grid.prototype.checkXY = function (x, y) {
            var pnt, col, row;

            col = this.getCol(x);
            pnt = col[y];

            if (!pnt) {
                row = this.getRow(y);
                col[y] = row[x] = this.makePoint(x, y); // indexed by x AND y
                return false;
            }
            return pnt;
        };
        Grid.prototype.getCol = function (n) {
            return this.cols[n] || (this.cols[n] = new Vector('col' + n));
        };
        Grid.prototype.getRow = function (n) {
            return this.rows[n] || (this.rows[n] = new Vector('row' + n));
        };
        Grid.prototype.makePoint = function (x, y) {
            var val = [x, y];

            Point.prototype.valueOf = function () {
                return val.concat(); // hidden
            };
            Point.prototype.toString = function () {
                return this.valueOf().join(':');
            };
            return new Point();
        };
        return new Grid();
    }());

    console.log('grid loaded');
    return GG;
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

//  |....A| x4.y0
//  |..B..| x2.y1
//  |C....| x0.y2

//   col[0] = [,,C]  |   row[0] = [,,,,A]
//   col[1] = []     |   row[1] = [,,B]
//   col[2] = [,B]   |   row[2] = [C]
//   col[3] = []     |
//   col[4] = [A]    |

//  Look for x2/y1 ... (col2, row1)
//    is there an array @2? (get column 2)
//      does that array have something @1? (check row 1)

//  What's in row 1?
//    get @1 from every col [,,B,,]

// x = [[,,C], [], [,B], [], [A]]
// y = [[,,,,A], [,,B], [C]]
// z = {
//    x: [[,,C], [], [,B], [], [A]],
//    y: [[,,,,A], [,,B], [C]],
// }
