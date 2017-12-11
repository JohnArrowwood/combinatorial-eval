import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';

describe( 'CombinatorialEval.generate()', function() {

    let validate = new CallbackTracker();

    context( 'with two parameters', function() {

        it( 'should call the callback once for each element of each dimension', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'] )
                .dimension( 'nuts', ['almond','cashew','walnut'] )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 9 );
        });

        it( 'should limit based on the `valid` expression', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'] )
                .dimension( 'fruit2', ['apple','banana','coconut'], 'fruit !== fruit2' )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 6 );

        })

    });

});