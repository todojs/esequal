// jshint esversion: 5, node: true
"use strict";
if (typeof require !== 'undefined' && typeof equal === 'undefined') {
    var equal = require( './esequal' );
}


// Basic types:
if (equal(1, 1)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}
if (equal('hello', 'hello')) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}
if (equal(true, true)){
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// Dates:
var date1 = new Date(2016,11,31);
var date2 = new Date(2016,11,31);

console.log('date1 =', date1);
console.log('date2 =', date2);
if (equal(date1, date2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// Objects:
var obj1 = {a: 1, b: 2};
var obj2 = {a: 1, b: 2};

console.log('obj1 =', obj1);
console.log('obj2 =', obj2);
if (equal(obj1, obj2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}


// Arrays:
var arr1 = [{a: 1}, {b: 2}, 3];
var arr2 = [{a: 1}, {b: 2}, 3];

console.log('arr1 =', arr1);
console.log('arr2 =', arr2);
if (equal(arr1, arr2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}


// Array Buffers:
var buffer1 = new ArrayBuffer(8);
new Uint32Array(buffer1).set([1000000, 1100000]);

var buffer2 = new ArrayBuffer(8);
new Uint16Array(buffer2).set([16960, 15, 51424, 16]);

console.log('buffer1 =', buffer1);
console.log('buffer2 =', buffer2);
if (equal(buffer1, buffer2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}

// Map:
var map1 = new Map();
var keyObj = {};
map1.set('a', "value associated with a string");
map1.set(1, "value associated with a number");
map1.set(keyObj, "value associated with keyObj");

var map2 = new Map();
map2.set('a', "value associated with a string");
map2.set(1, "value associated with a number");
map2.set(keyObj, "value associated with keyObj");

console.log('map1 =', map1);
console.log('maps =', map2);
if (equal(map1, map2)) {
    console.log('they are equal');
} else {
    console.log('they are not equal');
}
