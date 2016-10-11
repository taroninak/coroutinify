'use strict'
const co = require('../index');
const Promise = require('bluebird');

describe('co', () => {

    it('Should resolve number', (done) => {
        function* generator() {
            let index = 0;
            while(index < 3)
                yield index++;
            return index;
        }

        co(generator)().then((value) => {
            return value == 3 ? done() : done(new Error('Wrong number - ' + number));
        }).catch((err) => { return done(err) });
    });

    it('Should resolve array', (done) => {
        function* generator() {
            let array = [];
            for(let index = 0; index < 3; index++)
                array.push(yield index);
            return array;
        }

        co(generator)().then((array) => {
            return (array[0] == 0 && array[1] == 1 && array[2] == 2)
                ? done()
                : done(new Error('Wrong array - ' + JSON.stringify(array)));
        }).catch((err) => { return done(err) });
    });

    it('Should resolve object', (done) => {
        function* generator() {
            let object = {};
            for(let index = 0; index < 3; index++)
                object['i' + index] = yield index;
            return object;
        }

        co(generator)().then((object) => {
            return (object['i' + 0] == 0 && object['i' + 1] == 1 && object['i' + 2] == 2)
                ? done()
                : done(new Error('Wrong object - ' + JSON.stringify(object)));
        }).catch((err) => { return done(err) });
    });

    it('Should coroutinify the whole object', (done) => {
        let object = {};
        object.f1 = function* () {
            let obj = {};
            for(let index = 0; index < 3; index++)
                obj['i' + index] = yield index;
            return obj;
        };

        object.f2 = function* () {
            let obj = {};
            for(let index = 0; index < 3; index++)
                obj['i' + index] = yield index;
            return obj;
        };

        co(object);

        Promise.all([object.f1(), object.f2()]).then((results) => {
            for(let index in results) {
                let obj = results[index];
                if(!(obj['i' + 0] == 0 && obj['i' + 1] == 1 && obj['i' + 2] == 2))
                    return done(new Error('Wrong results - ' + JSON.stringify(results)));
            }
            return done();
        }).catch((err) => { return done(err) });
    });
})
