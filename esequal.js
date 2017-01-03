/* jshints esversion: 5 */
(function (root) {
    "use strict";

    function equal(a, b, options) {
        options = options || {};            // Optional parameter
        if (a === b) {                      // Strict comparison
            return equal.VALUE_AND_TYPE;    // Equal value and type
        }
        /* jshint -W116 */
        if (options.nonStrict && a == b) {  // Non strict comparison (optional)
            return equal.VALUE;             // Equal value (different type)
        }
        /* jshint +W116 */
        return equal.NOT_EQUAL;             // Not equal
    }
    equal.NOT_EQUAL           = 0;
    equal.VALUE               = 1;
    equal.VALUE_AND_TYPE      = 2;


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