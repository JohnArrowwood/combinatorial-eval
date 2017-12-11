import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';
import { Variable,ProgressiveEvaluation } from 'progressive-eval';

let validate = new CallbackTracker();

describe ( "CombinatorialEval.generate( callback, context )", function() {

    it( "should pass the context into the validation expressions", function() {
        let ce = new CombinatorialEval()
            .dimension( 'letter', ['A','B','C'], 'letter !== skip.letter' )
            .dimension( 'digit', ['1','2','3'], 'digit !== skip.digit' )
            .dimension( 'symbol', ['!','@','#'], 'symbol !== skip.symbol' )
            .generate( validate.callback(), ProgressiveEvaluation.from({
                skip: new Variable('skip').value({
                    letter: 'A',
                    digit: '2',
                    symbol: '#'
                })
            }));
        expect( validate.counter ).to.equal( 8 );
    });
});