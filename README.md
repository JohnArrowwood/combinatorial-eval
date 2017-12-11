# combinatorial-eval

Generate every combination of possible values for some set of parameters.

In testing it is sometimes of value to map out what the different parameters are for a particular feature or block of code, and then generating the full list of every distinct combination.

This is typically accomplished by writing a bunch of nested `for` loops.  For speed, those loops skip invalid combinations as soon as possible, so that we don't waste time generating hundreds if not thousands of invalid sub-combinations, only to throw them away.

This module exists to abstract away this process, so that a GUI can be built to make it easier. 

## Installation

    npm install --save combinatorial-eval

## Usage

Generate all possible combinations

    import { CombinatorialEval } from 'combinatorial-eval';

    let callback = (o) => { console.log( o ); };

    new CombinatorialEval()
        .dimension( 'letter', ['A','B','C'] )
        .dimension( 'digit',  ['1','2','3'] )
        .dimension( 'symbol'  ['!','@','#'] )
        .generate( callback );
    // outputs 27 ( 3*3*3 ) objects, one for each combination
    // in order:  A1!, A1@, A!#, A2!, A2@, A2#, A3!, A3@, A3#, B1!, ...

Process each dimension in a random order

    new CombinatorialEval()
        .dimension( 'letter', "ABCDEFGHIJKLMNOPQRUSTUVWXYZ".split('') )
        .shuffle()
        .generate( callback );
    // outputs one item per letter, but in random order

Apply a validation filter

    new CombinatorialEval()
        .dimension( 'letter', ['A','B','C'] )
        .dimension( 'digit',  ['1','2','3'], 'letter+digit !== "A1"' )
        .dimension( 'symbol'  ['!','@','#'] )
        .generate( callback );
    // outputs 24 combinations, omitting all those where letter is A and digit is 1

Pass in a ProgressiveEvaluation context to make variables available to the validation filter

    let context = ProgressiveEvaluation.from({
        skip: new Variable('skip').value('bar')
    });
    new CombinatorialEval()
        .dimension( 'word', ['foo','bar','baz','blip'], 'word !== skip' )
        .generate( callback, context );
    // generates three outputs, skipping the one where word is 'bar'

