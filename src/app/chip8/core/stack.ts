
export class Stack {

    private _Stack: Uint16Array;

    private _StackPointer: number;

    private STACK_SIZE: number = 16;

    constructor() {
        this._Stack = new Uint16Array(this.STACK_SIZE);
        this._StackPointer = 0;
    }

    public incrementStackPointer() {
        if(this._StackPointer >= this.STACK_SIZE) {
            return;
        }
        
        this._StackPointer++;
    }

    public decrementStackPointer() {
        if(this._StackPointer <= 0) {
            return;
        }

        this._StackPointer--;
    }

    public push(address: number) {
        this.incrementStackPointer();
        this._Stack[this._StackPointer] = address;
    }

    public pop(): number {
        const address = this._Stack[this._StackPointer];
        this.decrementStackPointer()

        return address;
    }

}