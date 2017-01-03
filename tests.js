// jshint esversion: 6, node: true
"use strict";
if (typeof require !== 'undefined' && typeof equal === 'undefined') {
    var equal = require( './esequal' );
}

console.log('Must be a function');
console.assert( typeof equal === 'function' );
console.assert( equal.length === 2 );
console.assert( equal.name === 'equal' );
console.log('--- Ok');

if (typeof process !== 'undefined' && typeof process.exit !== 'undefined') {
    process.exit( 0 );
}