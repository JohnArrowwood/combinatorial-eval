import { expect } from 'chai';

export function shouldThrow( block: Function ) {
    let thrown = false;
    try { block() }
    catch (e) { thrown = true; console.log( e.message ); }
    expect( thrown ).to.be.true;
}
