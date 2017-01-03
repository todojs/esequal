/* jshints esversion: 5 */
(function (root) {
    "use strict";

    function equal(a, b, options) {
        var aValue, bValue,                                 // Define variables
            aType = typeof a,                               // Get value types
            bType = typeof b;
        options = options || {};                            // Optional parameter
        if (a === b) {                                      // Strict comparison
            return equal.VALUE_AND_TYPE;                    // Equal value and type
        }
        /* jshint -W116 */
        if (options.nonStrict && a == b) {                  // Non strict comparison (optional)
            return equal.VALUE;                             // Equal value (different type)
        }
        /* jshint +W116 */
        if (aType === 'undefined' ||                        // undefined and null are always different than other values
            bType === 'undefined' ||
            a === null ||
            b === null)
        {
            return equal.NOT_EQUAL;
        }
        if (aType === 'number' &&                           // Special case: Not is a Number (NaN !== NaN)
            bType === 'number' &&
            isNaN(a) &&
            isNaN(b))
        {
            return equal.VALUE_AND_TYPE;
        }
        if (typeof a.valueOf === 'function' &&              // valueOf() is a function in both values
            typeof b.valueOf === 'function')
        {
            aValue = a.valueOf();                           // Get valueOf()
            bValue = b.valueOf();
            if (aValue !== a || bValue !== b) {             // The valueOf's return is different that the base value
                if (aValue === bValue) {                    // The valueOf's return is the same for both values
                    if (a.constructor === b.constructor) {  // It's the same constructor and as result is the same type
                        return equal.VALUE_AND_TYPE;
                    } else {
                        return equal.VALUE;                 // Equal value (different type)
                    }
                }
            }
        }
        return equal.NOT_EQUAL;                             // Not equal
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