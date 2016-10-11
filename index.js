'use strict'
const Promise = require('bluebird');

Promise.coroutine.addYieldHandler(function(value) {
    return Promise.resolve(value);
});

function co (object, options) {
    if(isGeneratorFunction(object)) {
        return coroutinify(object, options);
    }
    return coroutinifyAll(object, options);
}

function coroutinify (method, options) {
    // Skip non generators
    if (!co.isGeneratorFunction(method)) return;
    if(!(options && options.name && options.context)) return Promise.coroutine(method, options);
    let name = options.name;
    const object = options.context;
    let nameGen = (typeof name !== 'symbol') ? name + 'Gen' : Symbol.for(name.toString() + 'Gen');
    object[nameGen] = method;
    object[name] = Promise.coroutine(method, options);
}

function coroutinifyAll (object) {
    var properties = [];
    properties.push.apply(properties, Object.getOwnPropertyNames(Object.getPrototypeOf(object)));
    properties.push.apply(properties, Object.getOwnPropertyNames(object));
    properties.push.apply(properties, Object.getOwnPropertySymbols(Object.getPrototypeOf(object)));
    properties.push.apply(properties, Object.getOwnPropertySymbols(object));

    properties.forEach((name) => {
        coroutinify(object[name], { context: object, name: name });
    });
    return object;
}

function isGeneratorFunction (object) {
    let constructor = object.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
}

function isGenerator (object) {
    return 'function' == typeof object.next && 'function' == typeof object.throw;
}

module.exports = co;
module.exports.coroutinify = coroutinify;
module.exports.coroutinifyAll = coroutinifyAll;
module.exports.isGeneratorFunction = isGeneratorFunction;
module.exports.isGenerator = isGenerator;
