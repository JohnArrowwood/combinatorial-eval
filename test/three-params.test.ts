import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';

describe( 'CombinatorialEval.generate()', function() {

    let validate = new CallbackTracker();

    context( 'with three parameters', function() {

        it( 'should call the callback once for each element of each dimension', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'] )
                .dimension( 'nut', ['almond','cashew','walnut'] )
                .dimension( 'flake', ['corn','wheat','oat'] )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 27 );
        });

        it( 'should limit based on the `valid` expression', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'], 'fruit !== "banana"' )
                .dimension( 'nut', ['almond','cashew','walnut'], 'nut !== "almond"' )
                .dimension( 'flake', ['corn','wheat','oat'] )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 12 );

        })

    });

});