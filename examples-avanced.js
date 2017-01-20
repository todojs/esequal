// jshint esversion: 6, node: true
"use strict";
if (typeof require !== 'undefined' && typeof equal === 'undefined') {
    var equal = require( './esequal' );
}

// nonStrict
if (equal("1", 1, {nonStrict: true})) {
  console.log('they are equal');
} else {
    console.log('they are not equal');
}

if (equal("1", 1)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// nonStrict
var arr1 = ['a', 'b', 'c'];
var arrLike2 = {'0': 'a', '1': 'b', '2': 'c'};
Object.defineProperty(arrLike2, 'length', {value: 3, enumerable: false});
if (equal(arr1, arrLike2, {nonStrict: true})) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// nonEnumerableProperties
var nonEnumerable = {};
Object.defineProperties( nonEnumerable, {
    a: {value: 1, enumerable: false},
    b: {value: 2, enumerable: false}}
);
var enumerable = {a: 1, b: 2};

if (equal(enumerable, nonEnumerable, {nonEnumerableProperties: true})) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// allProperties
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
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// checkPropertyDescritors
var notWritable = {};
Object.defineProperties( notWritable, {
    a: {value: 1, writable: false, enumerable: true},
    b: {value: 2, writable: false, enumerable: true}}
);
var writable = {a: 1, b: 2};

if (equal(notWritable, writable, {checkPropertyDescritors: true})) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// privateProperties
var priv1 = {
    p: true,
    _x: 10,
    _z: 20
};
var priv2 = {
    p: true,
    _x: 0,
    _z: 0
};
if (equal(priv1, priv2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}
if (equal(priv1, priv2, {privateProperties: true})) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

if (typeof process !== 'undefined' && typeof process.exit !== 'undefined') {
    process.exit( 0 );
}
