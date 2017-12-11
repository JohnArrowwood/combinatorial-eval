import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';

describe( "CombinatorialEval.shuffle()", function() {

    let name = 'letter';
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let validate = new CallbackTracker();

    it( 'should return the values in random order', function() {
        let ce = new CombinatorialEval().shuffle().dimension(name,letters.split('')).generate( validate.callback() );
        expect( validate.counter ).to.equal( letters.length );
        expect( validate.order.map( x => x.values.letter ).join('') ).to.not.equal( letters );
    });

    it( 'should be possible to turn shuffle off', function() {
        let ce = new CombinatorialEval().shuffle(false).dimension(name,letters.split('')).generate( validate.callback() );
        expect( validate.counter ).to.equal( letters.length );
        expect( validate.order.map( x => x.values.letter ).join('') ).to.equal( letters );
    });

});