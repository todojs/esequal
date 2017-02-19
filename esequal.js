/* jshints esversion: 5 */
/* globals Map: false, Set: false, module: false, exports: false, Object: false */
(function (root) {
    "use strict";

    var MAP_SUPPORT         = typeof Map !== 'undefined' &&         // Check Map support
                              Map.prototype.keys &&
                              Map.prototype.values;
    var SET_SUPPORT         = typeof Set !== 'undefined' &&         // Check Set support
                              Map.prototype.values;
    var ARRAYBUFFER_SUPPORT = typeof ArrayBuffer !== 'undefined';   // Check ArrayBuffer support
    var DATAVIEW_SUPPORT    = typeof DataView !== 'undefined';      // Check DataView support

    var NOT_EQUAL           = 0;                                    // Return values
    var VALUE               = 1;
    var VALUE_AND_TYPE      = 2;
    var PROPERTIES          = 3;
    var PROPERTIES_AND_TYPE = 4;
    var OBJECT              = 5;
    var FUNCTION            = 6;

    function equal(a, b, options) {
        var aStack = [],                                            // Stack array
            bStack = [];
        options || (options = {});                                  // Optional parameter
        return (function check(a, b) {
            var aValue, bValue, aKeys, bKeys, key, i,               // Define variables
                aDescriptor, bDescriptor,
                aType = typeof a,                                   // Get value types
                bType = typeof b;
            if (a === b) {                                          // Strict comparison
                if (aType === 'object' && a !== null) {
                    return OBJECT;                                  // Equal object
                } else if (aType === 'function') {
                    return FUNCTION;                                // Equal function
                }
                return VALUE_AND_TYPE;                              // Equal value and type
            }
            /* jshint -W116 */
            if (options.nonStrict && a == b) {                      // Non strict comparison (optional)
                return VALUE;                                       // Equal value (different type)
            }
            /* jshint +W116 */
            if (aType === 'undefined' ||                            // undefined and null are always different
                bType === 'undefined' ||
                a === null ||
                b === null)
            {
                return NOT_EQUAL;
            }
            if (aType === 'number' &&                               // Special case: Not is a Number (NaN !== NaN)
                bType === 'number' &&
                isNaN(a) &&
                isNaN(b))
            {
                return VALUE_AND_TYPE;
            }
            if (typeof a.valueOf === 'function' &&                  // valueOf() is a function in both values
                typeof b.valueOf === 'function')
            {
                aValue = a.valueOf();                               // Get valueOf()
                bValue = b.valueOf();
                if (aValue !== a || bValue !== b) {                 // The valueOf's return is different that the base value
                    if (aValue === bValue) {                        // The valueOf's return is the same for both values
                        if (a.constructor === b.constructor) {      // It's the same constructor and as result is the same type
                            return VALUE_AND_TYPE;
                        }
                        if (options.nonStrict) {                    // Non strict comparison (optional)
                            return VALUE;                           // Equal value (different type)
                        }
                        return NOT_EQUAL;                           // Strict comparison
                    }
                    /* jshint -W116 */
                    if (options.nonStrict &&                        // Non strict comparison (optional)
                        aValue == bValue)
                    {
                        return VALUE;                               // Equal value (different type)
                    }
                    /* jshint +W116 */
                    return NOT_EQUAL;                               // Not equal
                }
            }
            if (aType !== bType) {                                  // Different type is a not equal value from this point
                return NOT_EQUAL;
            }
            if (aType === 'object' ||                               // Objects
                aType === 'function')                               // and functions
            {
                if (aStack.indexOf(a) > -1 &&                       // Check if the object has been previously processed
                    bStack.indexOf(b) > -1)
                {
                    return OBJECT;
                }
                aKeys = getProperties(a, options);                  // Get properties with options
                bKeys = getProperties(b, options);
                if (aKeys.length !== bKeys.length) {                // Check number of properties
                    return NOT_EQUAL;
                }
                if (aKeys.length > 0) {
                    aStack.push(a);                                 // Storage objects into stacks for recursive reference
                    bStack.push(b);
                    i = aKeys.length;
                    while (i--) {                                   // Check each property value (recursive call)
                        key = aKeys[i];
                        if (!check(a[key], b[key])) {
                            return NOT_EQUAL;
                        }
                        if (options.checkPropertyDescritors) {      // Check property descriptor (optional)
                            aDescriptor = Object.getOwnPropertyDescriptor(a, key);
                            bDescriptor = Object.getOwnPropertyDescriptor(b, key);
                            if (!aDescriptor && !bDescriptor && options.allProperties) {
                                continue;
                            }
                            if (aDescriptor.enumerable !== bDescriptor.enumerable ||
                                aDescriptor.writable !== bDescriptor.writable ||
                                aDescriptor.configurable !== bDescriptor.configurable) {
                                return NOT_EQUAL;
                            }
                        }
                    }
                }
                if (( a instanceof RegExp && b instanceof RegExp ) ||   // RegExp and Error family objects
                    ( a instanceof Error && b instanceof Error  ))
                {
                    if (a.toString() !== b.toString()) {
                        return NOT_EQUAL;
                    }
                } else if (
                    (MAP_SUPPORT &&
                        a instanceof Map && b instanceof Map) ||    // Map
                    (SET_SUPPORT &&
                        a instanceof Set && b instanceof Set))      // Set
                {
                    if (a.size !== b.size) {                        // Check size
                        return NOT_EQUAL;
                    }
                    i = a.size;
                    if (i > 0) {
                        if (a instanceof Map && b instanceof Map) {
                            aKeys = Array.from(a.keys());
                            bKeys = Array.from(b.keys());
                            while (i--) {
                                if (bKeys.indexOf(aKeys[i]) === -1 ||
                                    !check(a.get(aKeys[i]), b.get(aKeys[i])))
                                {
                                    return NOT_EQUAL;
                                }
                            }
                            return VALUE_AND_TYPE;
                        }
                        if (check(Array.from(a.values()).sort(), Array.from(b.values()).sort())) {
                            return VALUE_AND_TYPE;
                        }
                        return NOT_EQUAL;
                    }
                } else if (ARRAYBUFFER_SUPPORT && DATAVIEW_SUPPORT &&   // ArrayBuffer
                    (a instanceof ArrayBuffer || a instanceof DataView) &&
                    (b instanceof ArrayBuffer || b instanceof DataView))
                {
                    aValue = a instanceof ArrayBuffer ? new DataView(a) : a;
                    bValue = b instanceof ArrayBuffer ? new DataView(b) : b;
                    if (aValue.byteLength !== bValue.byteLength) {  // Check size
                        return NOT_EQUAL;
                    }
                    i = bValue.byteLength;                          // Check content
                    while (i--) {
                        if (aValue.getInt8(i) !== bValue.getInt8(i)) {  // nonStrict comparison is not supported
                            return NOT_EQUAL;
                        }
                    }
                } else if ((aType === 'function')) {                // Function type
                    if (options.functionSource && a.toString() === b.toString()) {
                        return FUNCTION;
                    }
                    return NOT_EQUAL;
                }
                if (a.constructor === b.constructor) {              // It's the same constructor
                    return PROPERTIES_AND_TYPE;                     // and as result is the same type
                }
                if (options.nonStrict) {                            // Non strict comparison (optional)
                    return PROPERTIES;                              // Equals property and different type
                }
            }
            return NOT_EQUAL;                                       // Not equal
        })(a, b);
    }

    equal.NOT_EQUAL           = NOT_EQUAL           ;               // Public return values
    equal.VALUE               = VALUE               ;
    equal.VALUE_AND_TYPE      = VALUE_AND_TYPE      ;
    equal.PROPERTIES          = PROPERTIES          ;
    equal.PROPERTIES_AND_TYPE = PROPERTIES_AND_TYPE ;
    equal.OBJECT              = OBJECT              ;
    equal.FUNCTION            = FUNCTION            ;

    // get object properties with different scope
    function getProperties(obj, options) {
        var result = [], tmp = [], prop, i;
        if (!options.nonEnumerableProperties &&                     // General case, own enumerable properties
            !options.allProperties)
        {
            for (prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop) &&
                    !(prop[0] === '_' && !options.privateProperties))
                {
                    result.push(prop);
                }
            }
            return result;
        }
        tmp = options.allProperties  ?                              // All properties
            (function getAllProp(obj) {
                var proto = Object.getPrototypeOf(obj);
                return (
                    typeof proto === 'object' && proto !== null ?
                        getAllProp(proto) :
                        []
                ).concat( Object.getOwnPropertyNames(obj) );
            })(obj) :
            Object.getOwnPropertyNames(obj);                        // All own properties (enumerable and nonenumerable)
        for (i = 0; i < tmp.length; i++) {
            prop = tmp[i];
            if ((prop[0] !== '_' || options.privateProperties) &&
                (!options.allProperties || tmp.indexOf(prop) === i))
            {
                result.push(prop);                                  // Filter private properties (_)
            }
        }
        return result;
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