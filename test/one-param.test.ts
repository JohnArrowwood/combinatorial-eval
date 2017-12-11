import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';

describe( 'CombinatorialEval.generate()', function() {

    let validate = new CallbackTracker();

    context( 'with only a single parameter', function() {

        it( 'should call the callback once for each element', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'] )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 3 );
        });

        it( 'should limit based on the `valid` expression', function() {
            let ce = new CombinatorialEval()
                .dimension( 'fruit', ['apple','banana','coconut'], 'fruit !== "apple"' )
                .generate( validate.callback() );
            expect( validate.counter ).to.equal( 2 );

        })

    });

});