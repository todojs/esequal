/* jshints esversion: 5 */
(function (root) {
    "use strict";

    var MAP_SUPPORT         = typeof Map !== 'undefined';
    var SET_SUPPORT         = typeof Set !== 'undefined';
    var ARRAYBUFFER_SUPPORT = typeof ArrayBuffer !== 'undefined';
    var DATAVIEW_SUPPORT    = typeof DataView !== 'undefined';

    function equal(a, b, options) {
        var aStack = [];                                        // Stack array
        var bStack = [];
        options = options || {};                                // Optional parameter
        return (function check(a, b) {
            var aValue, bValue, aKeys, bKeys, i,                // Define variables
                aDescriptor, bDescriptor,
                aType = typeof a,                               // Get value types
                bType = typeof b;
            if (a === b) {                                      // Strict comparison
                if (aType === 'object' && a !== null) {
                    return equal.OBJECT;                        // Equal object
                } else if (aType === 'function') {
                    return equal.FUNCTION;                      // Equal function
                } else {
                    return equal.VALUE_AND_TYPE;                // Equal value and type
                }
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
            if (a instanceof Object &&                          // Objects
                b instanceof Object)
            {
                if (aStack.indexOf(a) > -1 &&                   // Check if the object has been previously processed
                    bStack.indexOf(b) > -1)
                {
                    return equal.OBJECT;
                }
                aStack.push(a);                                 // Storage objects into stacks for recursive reference
                bStack.push(b);
                aKeys = getProperties(a, options);              // Get properties with options
                bKeys = getProperties(b, options);
                if (aKeys.length !== bKeys.length) {            // Check number of properties
                    return equal.NOT_EQUAL;
                }
                if (aKeys.join('') !== bKeys.join('')) {        // Check name of properties
                    return equal.NOT_EQUAL;
                }
                for (i = 0; i < aKeys.length; i++) {            // Check each property value (recursive call)
                    if (!check(a[aKeys[i]], b[bKeys[i]])) {
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
                if (( a instanceof RegExp && b instanceof RegExp ) ||   // RegExp and Error family objects
                    ( a instanceof Error && b instanceof Error  ))
                {
                    if (a.toString() !== b.toString()) {
                        return equal.NOT_EQUAL;
                    }
                } else if ((MAP_SUPPORT &&                                 // Map
                            a instanceof Map && a.entries &&
                            b instanceof Map &&  b.entries) ||
                           (SET_SUPPORT &&                                 // Set
                            a instanceof Set && a.entries &&
                            b instanceof Set && b.entries))
                {
                    if (a.size !== b.size) {                            // Check size
                        return equal.NOT_EQUAL;
                    }
                    if ( check( Array.from( a.entries() ), Array.from( b.entries() ) ) ) {  // Recursive call as Array
                        return equal.VALUE_AND_TYPE;
                    } else {
                        return equal.NOT_EQUAL;
                    }
                } else if (ARRAYBUFFER_SUPPORT && DATAVIEW_SUPPORT &&      // ArrayBuffer
                           a instanceof ArrayBuffer && b instanceof ArrayBuffer)
                {
                    aValue = new DataView(a);                       // Get DataView
                    bValue = new DataView(b);
                    if (aValue.byteLength !== bValue.byteLength) {  // Check size
                        return equal.NOT_EQUAL;
                    }
                    i = bValue.byteLength;                          // Check content
                    while (i--) {
                        if (aValue.getInt8(i) !== bValue.getInt8(i)) {  // nonStrict comparison is not supported
                            return equal.NOT_EQUAL;
                        }
                    }
                } else if ((aType === 'function')) {                // Function type
                    if (options.functionSource && a.toString() === b.toString()) {
                        return equal.FUNCTION;
                    }
                    return equal.NOT_EQUAL;
                }
                if (a.constructor === b.constructor) {          // It's the same constructor and as result is the same type
                    return equal.PROPERTIES_AND_TYPE;
                }
                if (options.nonStrict) {                        // Non strict comparison (optional)
                    return equal.PROPERTIES;
                }
            }
            return equal.NOT_EQUAL;                             // Not equal
        })(a, b);
    }
    equal.NOT_EQUAL           = 0;
    equal.VALUE               = 1;
    equal.VALUE_AND_TYPE      = 2;
    equal.PROPERTIES          = 3;
    equal.PROPERTIES_AND_TYPE = 4;
    equal.OBJECT              = 5;
    equal.FUNCTION            = 6;

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