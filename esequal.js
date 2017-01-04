/* jshints esversion: 5 */
(function (root) {
    "use strict";

    function equal(a, b, options) {
        var aValue, bValue, aKeys, bKeys, i,                // Define variables
            aDescriptor, bDescriptor,
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
                        if (options.nonStrict) {            // Non strict comparison (optional)
                            return equal.VALUE;             // Equal value (different type)
                        }
                        return equal.NOT_EQUAL;             // Strict comparison
                    }
                }
                /* jshint -W116 */
                if (options.nonStrict &&                    // Non strict comparison (optional)
                    aValue == bValue)
                {
                    return equal.VALUE;                     // Equal value (different type)
                }
                /* jshint +W116 */
                return equal.NOT_EQUAL;                     // Not equal
            }
        }
        if (aType !== bType) {                              // Different type is a not equal value from this point
            return equal.NOT_EQUAL;
        }
        if (aType === 'object') {                           // Objects
            aKeys = getProperties(a, options);              // Get properties with options
            bKeys = getProperties(b, options);
            if (aKeys.length !== bKeys.length) {            // Check number of properties
                return equal.NOT_EQUAL;
            }
            if (aKeys.join('') !== bKeys.join('')) {        // Check name of properties
                return equal.NOT_EQUAL;
            }
            for (i = 0; i < aKeys.length; i++) {            // Check each property value (recursive call)
                if (!equal(a[aKeys[i]], b[bKeys[i]], options)) {
                    return equal.NOT_EQUAL;
                }
                if (options.checkPropertyDescritors) {      // Check property descriptor (optional)
                    aDescriptor = Object.getOwnPropertyDescriptor(a, aKeys[i]);
                    bDescriptor = Object.getOwnPropertyDescriptor(b, bKeys[i]);
                    if (aDescriptor.enumerable   !== bDescriptor.enumerable ||
                        aDescriptor.writable     !== bDescriptor.writable   ||
                        aDescriptor.configurable !== bDescriptor.configurable )
                    {
                        return equal.NOT_EQUAL;
                    }
                }
            }
            if (a.constructor === b.constructor) {          // It's the same constructor and as result is the same type
                return equal.PROPERTIES_AND_TYPE;
            }
            if (options.nonStrict) {                        // Non strict comparison (optional)
                return equal.PROPERTIES;
            }
            return equal.NOT_EQUAL;                         // Not equal
        }
        return equal.NOT_EQUAL;                             // Not equal
    }
    equal.NOT_EQUAL           = 0;
    equal.VALUE               = 1;
    equal.VALUE_AND_TYPE      = 2;
    equal.PROPERTIES          = 3;
    equal.PROPERTIES_AND_TYPE = 4;

    // get object properties with different scope
    function getProperties(obj, options) {
        return (
            options.allProperties  ?                            // All properties
                (function getAllProp(obj) {
                    var proto = Object.getPrototypeOf(obj);
                    return (
                        typeof proto === 'object' && proto !== null ?
                            getAllProp(proto) :
                            []
                    ).concat( Object.getOwnPropertyNames(obj) );
                })(obj) :
                options.nonEnumerableProperties ?
                    Object.getOwnPropertyNames(obj) :           // All own properties (enumerable and nonenumerable)
                    Object.keys(obj)                            // All own enumerable properties
        )
            .sort()
            .filter( function(prop, pos, arr) {
                if (prop[0] === '_' && !options.privateProperties) {
                    return false;                               // Filter private properties (_)
                }                                               // Eliminate duplicates (for all properties)
                return !options.allProperties || pos === 0 || arr[pos - 1] !== prop;
            });
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