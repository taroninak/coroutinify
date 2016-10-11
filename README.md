# Coroutinify

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

**Coroutinify** is a simple [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) based control flow middlware package for [Node.js](https://nodejs.org).

It's like [Bluebirds' coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html) and uses it internally.
In spite of Bluebird's coroutine, it can be used not only with [GeneratorFunctions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) but also with objects which contain GeneratorFunctions. It supports [ES6 classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) and [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) keys too.

In case of object the original functions are not removed but added **Gen** suffix to its name.

## Usage
### For single function
```javascript
const co = require('coroutinify');
function* generator() {
    let index = 0;
    while(index < 3)
        yield index++;
    return index;
}
co(generator)()
.then(value => console.log(value));    
```

### For the whole object which also has Symbol keys
```javascript
const co = require('coroutinify');
const Promise = require('bluebird');
let objcet = {};
object.gen1 = function* () {
    let index = 0;
    while(index < 3)
        yield index++;
    return index;
};
objcet.gen2 = function* () {
    let index = 0;
    while(index < 3)
        yield index++;
    return index;
};
objcet[Symbol.for('gen3')] = function* () {
    let index = 0;
    while(index < 3)
        yield index++;
    return index;
};
co(object);
Promise.all([
    object.gen1(),
    object.gen2(),
    objcet[Symbol.for('gen3')]()])
    .then(results => console.log(results));    
```

### For ES6 class instances
```javascript
const co = require('coroutinify');
const Promise = require('bluebird');
class ES6 {
    *gen1 () { yield 1; }
    *gen2 () { yield 2; }
    *[Symbol.for('gen3')] { yield 3; }
}

let es6Instance = new ES6();

co(es6Instance);
Promise.all([
    es6Instance.gen1(),
    es6Instance.gen2(),
    es6Instance[Symbol.for('gen3')]()])
    .then(results => console.log(results));    
```

## License
[MIT](https://github.com/taronpa/coroutinify/blob/master/LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/coroutinify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/coroutinify
[travis-image]: https://img.shields.io/travis/taronpa/coroutinify.svg?style=flat-square
[travis-url]: https://travis-ci.org/taronpa/coroutinify
[coveralls-image]: https://img.shields.io/coveralls/taronpa/coroutinify.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/taronpa/coroutinify
[downloads-image]: http://img.shields.io/npm/dm/coroutinify.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/coroutinify
