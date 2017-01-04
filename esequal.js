/* jshints esversion: 5 */
/* globals Map: false, Set: false, module: false, exports: false, Object: false */
(function (root) {
    "use strict";

    var MAP_SUPPORT         = typeof Map !== 'undefined';
    var SET_SUPPORT         = typeof Set !== 'undefined';
    var ARRAYBUFFER_SUPPORT = typeof ArrayBuffer !== 'undefined';
    var DATAVIEW_SUPPORT    = typeof DataView !== 'undefined';
    var NOT_EQUAL           = 0;
    var VALUE               = 1;
    var VALUE_AND_TYPE      = 2;
    var PROPERTIES          = 3;
    var PROPERTIES_AND_TYPE = 4;
    var OBJECT              = 5;
    var FUNCTION            = 6;

    function equal(a, b, options) {
        var aStack = [],                                                // Stack array
            bStack = [];
        options = options || {};                                        // Optional parameter
        return (function check(a, b) {
            var aValue, bValue, aKeys, bKeys, i,                        // Define variables
                aDescriptor, bDescriptor,
                aType = typeof a,                                       // Get value types
                bType = typeof b;
            if (a === b) {                                              // Strict comparison
                if (aType === 'object' && a !== null) {
                    return OBJECT;                                      // Equal object
                } else if (aType === 'function') {
                    return FUNCTION;                                    // Equal function
                }
            return VALUE_AND_TYPE;                                      // Equal value and type
            }
            /* jshint -W116 */
            if (options.nonStrict && a == b) {                          // Non strict comparison (optional)
                return VALUE;                                           // Equal value (different type)
            }
            /* jshint +W116 */
            if (aType === 'undefined' ||                                // undefined and null are always different
                bType === 'undefined' ||
                a === null ||
                b === null)
            {
                return NOT_EQUAL;
            }
            if (aType === 'number' &&                                   // Special case: Not is a Number (NaN !== NaN)
                bType === 'number' &&
                isNaN(a) &&
                isNaN(b))
            {
                return VALUE_AND_TYPE;
            }
            if (typeof a.valueOf === 'function' &&                      // valueOf() is a function in both values
                typeof b.valueOf === 'function')
            {
                aValue = a.valueOf();                                   // Get valueOf()
                bValue = b.valueOf();
                if (aValue !== a || bValue !== b) {                     // The valueOf's return is different that the base value
                    if (aValue === bValue) {                            // The valueOf's return is the same for both values
                        if (a.constructor === b.constructor) {          // It's the same constructor and as result is the same type
                            return VALUE_AND_TYPE;
                        }
                        if (options.nonStrict) {                        // Non strict comparison (optional)
                            return VALUE;                               // Equal value (different type)
                        }
                        return NOT_EQUAL;                               // Strict comparison
                    }
                    /* jshint -W116 */
                    if (options.nonStrict &&                            // Non strict comparison (optional)
                        aValue == bValue)
                    {
                        return VALUE;                                   // Equal value (different type)
                    }
                    /* jshint +W116 */
                    return NOT_EQUAL;                                   // Not equal
                }
            }
            if (aType !== bType) {                                      // Different type is a not equal value from this point
                return NOT_EQUAL;
            }
            if (a instanceof Object &&                                  // Objects
                b instanceof Object)
            {
                if (aStack.indexOf(a) > -1 &&                           // Check if the object has been previously processed
                    bStack.indexOf(b) > -1)
                {
                    return OBJECT;
                }
                aStack.push(a);                                         // Storage objects into stacks for recursive reference
                bStack.push(b);
                aKeys = getProperties(a, options);                      // Get properties with options
                bKeys = getProperties(b, options);
                if (aKeys.length !== bKeys.length) {                    // Check number of properties
                    return NOT_EQUAL;
                }
                if (aKeys.join('') !== bKeys.join('') &&                // Check name of properties
                    aKeys.sort().join('') !== bKeys.sort().join(''))
                {

                    return NOT_EQUAL;
                }
                i = aKeys.length;
                while (i--) {                                           // Check each property value (recursive call)
                    if (!check(a[aKeys[i]], b[bKeys[i]])) {
                        return NOT_EQUAL;
                    }
                    if (options.checkPropertyDescritors) {              // Check property descriptor (optional)
                        aDescriptor = Object.getOwnPropertyDescriptor(a, aKeys[i]);
                        bDescriptor = Object.getOwnPropertyDescriptor(b, bKeys[i]);
                        if (!aDescriptor && !bDescriptor && options.allProperties) {
                            continue;
                        }
                        if (aDescriptor.enumerable   !== bDescriptor.enumerable ||
                            aDescriptor.writable     !== bDescriptor.writable   ||
                            aDescriptor.configurable !== bDescriptor.configurable )
                        {
                            return NOT_EQUAL;
                        }
                    }
                }
                if (( a instanceof RegExp && b instanceof RegExp ) ||   // RegExp and Error family objects
                    ( a instanceof Error && b instanceof Error  ))
                {
                    if (a.toString() !== b.toString()) {
                        return NOT_EQUAL;
                    }
                } else if ((MAP_SUPPORT &&                              // Map
                            a instanceof Map && a.entries &&
                            b instanceof Map &&  b.entries) ||
                           (SET_SUPPORT &&                              // Set
                            a instanceof Set && a.entries &&
                            b instanceof Set && b.entries))
                {
                    if (a.size !== b.size) {                            // Check size
                        return NOT_EQUAL;
                    }
                    if ( check( Array.from( a.entries() ), Array.from( b.entries() ) ) ) {  // Recursive call as Array
                        return VALUE_AND_TYPE;
                    }
                    return NOT_EQUAL;
                } else if (ARRAYBUFFER_SUPPORT && DATAVIEW_SUPPORT &&   // ArrayBuffer
                           a instanceof ArrayBuffer && b instanceof ArrayBuffer)
                {
                    aValue = new DataView(a);                           // Get DataView
                    bValue = new DataView(b);
                    if (aValue.byteLength !== bValue.byteLength) {      // Check size
                        return NOT_EQUAL;
                    }
                    i = bValue.byteLength;                              // Check content
                    while (i--) {
                        if (aValue.getInt8(i) !== bValue.getInt8(i)) {  // nonStrict comparison is not supported
                            return NOT_EQUAL;
                        }
                    }
                } else if ((aType === 'function')) {                    // Function type
                    if (options.functionSource && a.toString() === b.toString()) {
                        return FUNCTION;
                    }
                    return NOT_EQUAL;
                }
                if (a.constructor === b.constructor) {                  // It's the same constructor
                    return PROPERTIES_AND_TYPE;                         // and as result is the same type
                }
                if (options.nonStrict) {                                // Non strict comparison (optional)
                    return PROPERTIES;                                  // Equals property and different type
                }
            }
            return NOT_EQUAL;                                           // Not equal
        })(a, b);
    }
    equal.NOT_EQUAL           = NOT_EQUAL           ;
    equal.VALUE               = VALUE               ;
    equal.VALUE_AND_TYPE      = VALUE_AND_TYPE      ;
    equal.PROPERTIES          = PROPERTIES          ;
    equal.PROPERTIES_AND_TYPE = PROPERTIES_AND_TYPE ;
    equal.OBJECT              = OBJECT              ;
    equal.FUNCTION            = FUNCTION            ;

    // get object properties with different scope
    function getProperties(obj, options) {
        var result = [], prop;
        if (!options.nonEnumerableProperties &&                         // General case, own enumerable properties
            !options.allProperties)
        {
            for (prop in obj) {
                if (obj.hasOwnProperty(prop) &&
                    !(prop[0] === '_' && !options.privateProperties))
                {
                    result.push(prop);
                }
            }
            return result;
        }
        return (
            options.allProperties  ?                                    // All properties
                (function getAllProp(obj) {
                    var proto = Object.getPrototypeOf(obj);
                    return (
                        typeof proto === 'object' && proto !== null ?
                            getAllProp(proto) :
                            []
                    ).concat( Object.getOwnPropertyNames(obj) );
                })(obj).sort() :
                Object.getOwnPropertyNames(obj)                         // All own properties (enumerable and nonenumerable)
        ).filter( function(prop, pos, arr) {
            if (prop[0] === '_' && !options.privateProperties) {
                return false;                                           // Filter private properties (_)
            }
            return (!options.allProperties ||                           // Eliminate duplicates
                    pos === 0 || arr[pos - 1] !== prop);
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