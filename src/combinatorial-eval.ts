import { 
    Expression, 
    Variable, 
    SetOfVariables, 
    VariableValues, 
    ProgressiveEvaluation,
    evaluationOrder
} from 'progressive-eval';

const IDENTIFIER = /^[_a-z][_a-z0-9]*$/i;

export type CombinationReceiver = ( params: VariableValues ) => void;

export class CombinatorialEval {

    private _dimensions: { [name:string]: Array<string> } = {};
    private _exceptions: SetOfVariables = {};
    private _shuffle: boolean = false;

    dimension( name: string, values: Array<string>, valid?: Expression ) {
        if ( name === null || 
             name === undefined || 
             name === '' || 
             ! IDENTIFIER.test( name ) )
                throw new Error( "Name must be a valid identifier" );
        
        if ( values === null ||
             values === undefined ||
             values.length < 1 ) 
            throw new Error( "Values must include one or more distinct values" );

        this._dimensions[name] = values;

        if ( valid !== null &&
             valid !== undefined &&
             valid !== '' ) {
            let v = new Variable( name, valid );
            if ( v.error ) {
                throw new Error( "Invalid expression: " + valid );
            } else {
                this._exceptions[name] = v;
            }
        } else {
            this._exceptions[name] = new Variable( name ).value( true );
        }
            
        return this;
    }

    shuffle( newValue: boolean = true ) {
        this._shuffle = newValue;
        return this;
    }

    generate( callback: CombinationReceiver, context?: ProgressiveEvaluation ) {

        if ( callback === null || callback === undefined ) throw new Error( "Callback required" );
        if ( context === null || context === undefined ) context = ProgressiveEvaluation.from({},{});

        let name;

        // if requested, shuffle the elements in each dimension
        function randomize(list) {
            let i = list.length - 1;
            while ( i > 0 ) {
                let n = Math.floor( Math.random() * i );
                let t = list[i];
                list[i] = list[n];
                list[n] = t;
                i--;
            }
        }
        if ( this._shuffle ) {
            for ( let name in this._dimensions ) {
                randomize( this._dimensions[name] );
            }    
        }

        // if requested, pre-sort the dimensions to influence the resulting evaluation sequence
        function preSort(list) {
            let deps = {};
            list.forEach( v => {
                deps[v.name] = Object.keys( v.dep ).length 
            });
            list.sort( (a,b) => 
                deps[a.name] > deps[b.name] 
                ? -1 
                : deps[b.name] > deps[a.name] 
                  ? 1
                  : 0 
            )
        }
        let order = evaluationOrder( this._exceptions, context.values, true, preSort )
        if ( order.length < 1 ) 
            throw new Error( "Problem evaluating the combinations due to possibly conflicting constraints" );
        
        // if there is any dimension not represented by order, such as due to a cyclic dependency
        // then throw an error
        let seen = {};
        order.forEach( (v) => { seen[v.name] = undefined } );
        for ( let name in this._dimensions ) {
            if ( ! seen.hasOwnProperty( name ) ) {
                throw new Error( "Problem with one or more expressions not being able to be evaluated" );
            }
        }

        // generate the execution call chain, starting at the end of the list and working towards the front
        function step( name: string, values: Array<string>, valid: Variable, next: Function ) {
            return function( context: ProgressiveEvaluation ) {
                for ( let i = 0 ; i < values.length ; i++ ) {
                    let currentContext = context.extend( { [name]: new Variable( name ).value( values[i] ) } );
                    if ( valid.evaluate( currentContext.values ) ) 
                        next( currentContext );
                }
            }
        }
        let i = order.length - 1;
        let result = callback;
        while ( i >= 0 ) {
            name = order[i].name;
            result = step( name, this._dimensions[name], order[i], result );
            i--;
        }

        // execute the call chain
        result( context );

        return this;
    }

}
