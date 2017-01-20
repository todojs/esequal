# esequal

EsEqual (EcmaScript Equal) make a **universal** and **deep comparison** between two values to determine if they **are equivalent**.

It's a simple function with less than 250 lines of code Javascript for **nodejs** and the **browser**, without dependencies, very quick and very robust.
 
It **can compare** Arrays, Array Buffers, Arrow Functions, Booleans, Class, Date, Error, Functions, Maps, Numbers, Objects, Regexp, Sets, Strings, Symbols and Typed Arrays.

**EcmaScript 6** is supported, but it works perfectly on **EcmaScript 5.1**.

## Installation

Using npm:
```bash
npm i --save esequal
```

In browser:
```html
<script src="esequal.js"></script>
```

In Node.js:
```js
var equal = require('esequal');
```

## Basic use

```js
equal( value1, value2 );
```
#### parameters

Must be all types of Javascript elements: arrays, array buffers, booleans, date, error, functions, maps, numbers, objects, regexp, sets, strings, symbols and typed arrays.

#### return

The function return ```0``` (falsy) when the parameters are not equivalents and more than ```0``` (truthy) when the values are equivalents (see Advanced Use for more information about these values).

#### Examples

- Basic types:
    ```js
    if (equal(1, 1)) { 
      // ... 
    }
    if (equal('hello', 'hello')) { 
      // ... 
    }
    if (equal(true, true)) { 
      // ... 
    }
    ```

- Dates:
    ```js
    var date1 = new Date(2016,11,31);
    var date2 = new Date(2016,11,31);
  
    if (equal(date1, date2)) { 
      // ... 
    }
    ```

- Objects:
    ```js
    var obj1 = {a: 1, b: 2};
    var obj2 = {a: 1, b: 2};
  
    if (equal(obj1, obj2)) { 
      // ... 
    }
    ```

- Arrays:
    ```js
    var arr1 = [{a: 1}, {b: 2}, 3];
    var arr2 = [{a: 1}, {b: 2}, 3];
  
    if (equal(arr1, arr2)) { 
      // ... 
    }
    ```
    
- Array Buffers:
    ```js
    var buffer1 = new ArrayBuffer(8);
    new Uint32Array(buffer1).set([1000000, 1100000]);
  
    var buffer2 = new ArrayBuffer(8);
    new Uint16Array(buffer2).set([16960, 15, 51424, 16]);
  
    if (equal(buffer1, buffer2)) {
      // ...
    }
    ```

- Map:
    ```js
    var keyObj = {};

    var map1 = new Map();
    map1.set('a', "value associated with a string");
    map1.set(1, "value associated with a number");
    map1.set(keyObj, "value associated with keyObj");
    
    var map2 = new Map();
    map2.set('a', "value associated with a string");
    map2.set(1, "value associated with a number");
    map2.set(keyObj, "value associated with keyObj");
    
    if (equal(map1, map2)) {
      console.log('Ok');
    }
    ```

## Advanced use (options)

#### Options

```js
equal( value1, value2, options );
```

```equal()``` accept a third parameter, an object with options than change the default behavior. The options than can be included are: 

- ```{nonStrict: true}```

    By default, the comparison include value and type. With this option as ````true```` the comparison is not strict, and the type is not checked.
    
    Simple comparison as ```==```.
     
    ```js
    if (equal("1", 1, {nonStrict: true})) {
        // ...
    }
    ```

    Example with Array and ArrayLike object.

    ```js
    var arr1 = ['a', 'b', 'c'];
    var arrLike2 = {'0': 'a', '1': 'b', '2': 'c'};
    Object.defineProperty(arrLike2, 'length', {value: 3, enumerable: false});
  
    if (equal(arr1, arrLike2, {nonStrict: true})) {
        // ...
    }
    ```
- ```{nonEnumerableProperties: true}```

    By default, only the own enumerable property are checked. With this option as ```true``` include the enumerable and nonenumerable properties into the comparison.
      
    ```js
    var notEnumerable = {};
    Object.defineProperties( notEnumerable, {
      a: {value: 1, enumerable: false},
      b: {value: 2, enumerable: false}}
    );
    var enumerable = {a: 1, b: 2};
    
    if (equal(enumerable, notEnumerable, {nonEnumerableProperties: true})) {
      // ...
    }
    ```

- ```{allProperties: true}```

    By default, only the own enumerable property are checked. With this option as ```true``` include the enumerable and nonenumerable, own and its prototype chain properties into the comparison. Include ```{nonEnumerableProperties: true}```.
     
    ```js
    var priv = new WeakMap();
    class ClassCheck  {
        constructor() {
            priv.set(this, {});
        }
        get a() {
            return priv.get(this).a;
        }
        set a(value) {
            var tmp = priv.get(this);
            tmp.a = value;
            priv.set(this, tmp);
        }
    }
    var fromClass1 = new ClassCheck();
    fromClass1.a = 10;
    fromClass1.b = 20;
    var fromClass2 = new ClassCheck();
    fromClass2.a = 10;
    fromClass2.b = 20;
    
    if (equal(fromClass1, fromClass2, {allProperties: true})) {
        // ...
    }
    ```

- ```{privateProperties: true}```

    By default, the property names with started with ```_``` are ignored. With this property as ```true``` these private properties are included into the comparison.
     
    ```js
    var priv1 = { p: true, _x: 10, _z: 20 };
    var priv2 = { p: true, _x: 0,  _z: 0  };
  
    if (equal(priv1, priv2)) {
        // ...
    }
    if (equal(priv1, priv2, {privateProperties: true})) {
        // ...
    }
    ```

- ```{checkPropertyDescritors: true}```

    By default, the properties name with first character ```_``` are ignore. With this property as ```true``` these private properties are included into the comparison.
     
     ```js
    var notWritable = {};
    Object.defineProperties( notWritable, {
        a: {value: 1, writable: false, enumerable: true},
        b: {value: 2, writable: false, enumerable: true}}
    );
    var writable = {a: 1, b: 2};
    
    if (!equal(notWritable, writable, {checkPropertyDescritors: true})) {
        // ...
    }
    ```

- ```{functionSource: true}``` (experimental feature)

    By default, the functions comparison return ``` true``` only when they are exactly the same object. With this options as ```true``` the source code returned with ```toString()``` is compare for not native functions. It is a experimental feature and must be used with careful. 


#### Return values

The ```equal()``` function return codes for a more accuracy comparison result. These values are defined as properties of ```equal``` function object: 

- ```equal.NOT_EQUAL``` (```0```) The comparison is false.
- ```equal.VALUE``` (```1```) The comparison is the same value.
- ```equal.VALUE_AND_TYPE``` (```2```) The comparison is the same value and same type.
- ```equal.PROPERTIES``` (```3```) The objects has the same properties values.
- ```equal.PROPERTIES_AND_TYPE``` (```4```) The objects has the same properties values and types.
- ```equal.OBJECT``` (```5```) The objects are exactly the same object.
- ```equal.FUNCTION``` (```6```) The functions are equivalents.

## Tests

The ```tests.js``` file include a huge number of checked case. This file use a simple ```console.assert()``` and don't have dependencies. You can use this test file on browser and Node.

