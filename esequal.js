/* jshints esversion: 5 */
(function (root) {
    "use strict";

    function equal(a, b, options) {
        var aType = typeof a, bType = typeof b; // Get value types
        options = options || {};                // Optional parameter
        if (a === b) {                          // Strict comparison
            return equal.VALUE_AND_TYPE;        // Equal value and type
        }
        /* jshint -W116 */
        if (options.nonStrict && a == b) {      // Non strict comparison (optional)
            return equal.VALUE;                 // Equal value (different type)
        }
        /* jshint +W116 */
        if (aType === 'undefined' ||            // undefined and null are always different than other values
            bType === 'undefined' ||
            a === null ||
            b === null)
        {
            return equal.NOT_EQUAL;
        }
        return equal.NOT_EQUAL;                 // Not equal
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