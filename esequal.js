/* jshints esversion: 5 */
(function (root) {
    "use strict";

    function equal(a, b) {
        if (a === b) {
            return true;
        }
        return false;
    }

    // Export for node and browser
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = equal;
        }
        exports.equal = equal;
    } else {
        root.equal = equal;
    }

})(this);