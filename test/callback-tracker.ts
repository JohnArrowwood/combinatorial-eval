export class CallbackTracker {
    public counter: number;
    public order: Array<any>;
    callback() {
        this.counter = 0;
        this.order = [];
        let self = this;
        return function(o) {
            self.counter++;
            self.order.push( o );
        };
    }
}