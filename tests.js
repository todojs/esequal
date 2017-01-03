// jshint esversion: 6, node: true
"use strict";
if (typeof require !== 'undefined' && typeof equal === 'undefined') {
    var equal = require( './esequal' );
}
console.log('equal()');

console.log('must be a function');
console.assert( typeof equal === 'function' );
console.assert( equal.length === 2 );
console.assert( equal.name === 'equal' );
console.log('--- Ok');

console.log( 'should make strict comparison' );
console.assert(  equal( "", "" ) );
console.assert( !equal( "Hello", "hello" ) );
console.assert(  equal( "Hello", "Hello" ) );
console.assert(  equal( true, true ) );
console.assert(  equal( false, false ) );
console.assert( !equal( true, false ) );
console.assert( !equal( true, 1 ) );
console.assert( !equal( true, 0 ) );
console.assert( !equal( true, "hello" ) );
console.assert( !equal( true, '' ) );
console.assert( !equal( false, 0 ) );
console.assert( !equal( false, "" ) );
console.assert( !equal( false, "hello" ) );
console.assert( !equal( null, 0 ) );
console.assert(  equal( null, null ) );
console.assert( !equal( null, "null" ) );
console.assert(  equal( 1, 1 ) );
console.assert( !equal( 1, 0 ) );
console.assert( !equal( 1, "1" ) );
console.assert( !equal( 1, "0" )  );
console.assert( !equal( 1.0001, 1.00009 ) );
console.assert(  equal( 1.0001, 1.0001 ) );
console.assert( !equal( 1.0001, '1.00009' ) );
console.assert( !equal( 1.0001, '1.0001' ) );
console.assert(  equal( undefined, undefined ) );
console.assert( !equal( undefined, "" ) );
console.assert( !equal( undefined, 1 ) );
console.assert( !equal( undefined, false ) );
console.assert( !equal( undefined, null ) );
console.assert( !equal( undefined, {} ) );
console.log('--- Ok');

if (typeof process !== 'undefined' && typeof process.exit !== 'undefined') {
    process.exit( 0 );
}