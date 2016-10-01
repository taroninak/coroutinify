const co = require('bluebird-co');

class Coroutinify {

    static co (object, options) {
        if(object instanceof Function) {
            return Coroutinify.coroutinify(object, options);
        }
        return Coroutinify.coroutinifyAll(object, options);
    }

    static coroutinify (method, options) {
        if(!(options && options.name && options.context)) return co.wrap(method, options);
        let name = options.name;
        const object = options.context;
        // Skip constructor
        if (!(method instanceof Function) || method == object.constructor) return;
        let nameGen = (typeof name !== 'symbol') ? name + 'Gen' : Symbol.for(name.toString() + 'Gen');
        object[nameGen] = method;
        object[name] = co.wrap(method, options);

    }

    static coroutinifyAll (object) {
        Object.getOwnPropertyNames(Object.getPrototypeOf(object)).forEach((name) => {
            Coroutinify.coroutinify(object[name], { context: object, name: name });
        });

        Object.getOwnPropertySymbols(Object.getPrototypeOf(object)).forEach((name) => {
            Coroutinify.coroutinify(object[name], { context: object, name: name });
        });
        return object;
    }
}


module.exports = Coroutinify.co;
module.exports.coroutinify = Coroutinify.coroutinify;
module.exports.coroutinifyAll = Coroutinify.coroutinifyAll;
