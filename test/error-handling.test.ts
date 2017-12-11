import { expect } from 'chai';
import 'mocha';

import { CombinatorialEval } from '../src/index';

import { CallbackTracker } from './callback-tracker';
import { shouldThrow } from './should-throw';

describe( "Error Handling", function() {

    let name = 'foo';
    let values = ['A','B','C'];
    let validate = new CallbackTracker();

    context( "CombinatorialEval.dimension()",  function() {
            
        context( "name", function() {
    
            it( "should throw an error if name is null", function() {
                shouldThrow( () => new CombinatorialEval().dimension(null,values) );
            });
    
            it( "should throw an error if name is undefined", function() {
                shouldThrow( () => new CombinatorialEval().dimension(undefined,values) );
            });
    
            it( "should throw an error if name is an empty string", function() {
                shouldThrow( () => new CombinatorialEval().dimension('',values) );
            });
    
            it( "should throw an error if name is not a valid identifier", function() {
                shouldThrow( () => new CombinatorialEval().dimension('foo:bar',values) );
            });
    
        });
    
        context( "values", function() {
    
            it( "should throw an error if values is null", function() {
                shouldThrow( () => new CombinatorialEval().dimension(name,null) );
            });
    
            it( "should throw an error if values is undefined", function() {
                shouldThrow( () => new CombinatorialEval().dimension(name,undefined) );
            });
    
            it( "should throw an error if values is empty", function() {
                shouldThrow( () => new CombinatorialEval().dimension(name,[]) );
            });
    
        });
    
        context( "valid", function() {
        
            it( "should ignore if `valid` is null", function() {
                let ce = new CombinatorialEval()
                    .dimension(name,values, null )
                    .generate( validate.callback() );
                expect( validate.counter ).to.equal( values.length );
            });
    
            it( "should ignore if `valid` is undefined", function() {
                let ce = new CombinatorialEval()
                    .dimension(name,values, undefined )
                    .generate( validate.callback() );
                expect( validate.counter ).to.equal( values.length );
            });
    
            it( "should ignore if `valid` is empty", function() {
                let ce = new CombinatorialEval()
                    .dimension(name,values, '' )
                    .generate( validate.callback() );
                expect( validate.counter ).to.equal( values.length );
            });
    
            it( "should throw an error if valid is an unparseable expression", function() {
                shouldThrow( () => new CombinatorialEval().dimension(name,values,'(name+') );
            });
    
        });
    
    });

    context( "CombinatorialEval.generate()", function() {

        it( "should throw if callback is null", function() {
            shouldThrow( () => {
                new CombinatorialEval()
                    .dimension(name,values)
                    .generate(null);
            });
        });

        it( "should throw if callback is undefined", function() {
            shouldThrow( () => {
                new CombinatorialEval()
                .dimension(name,values)
                .generate(undefined);
            });
        });

        it( "should throw if there are no dimensions defined", function() {
            shouldThrow( () => {
                new CombinatorialEval().generate( validate.callback() );
            });
        });

        it( "should throw if the validation expressions contain any unsatisfied dependencies", function() {
            shouldThrow( () => {
                new CombinatorialEval()
                    .dimension('letter',['A','B','C'],'letter !== not_found' )
                    .dimension('digit',['1','2','3'])
                    .dimension('symbol',['!','@','#'])
                    .generate( validate.callback() );
            })
        });

    });

});
