
export class Registers {
    private _V: Uint8Array;

    private _delayRegister: number;

    get delayRegister() {
        return this._delayRegister;
    }

    set delayRegister(value: number) {
        this._delayRegister = value;
    }

    private _soundRegister: number;

    get soundRegister() {
        return this._soundRegister;
    }

    set soundRegister(value: number) {
        this._soundRegister = value;
    }
    private _I: number;

    get I() {
        return this._I;
    }

    set I(value: number) {
        this._I = value;
    }

    private REGISTERS_COUNT = 16;

    constructor() {
        this._V = new Uint8Array(this.REGISTERS_COUNT);
        this.delayRegister = 0;
        this.soundRegister = 0;
        this._I = 0;
    }

    setVRegister(registerNumber: number, value: number): void {
        if(registerNumber < 0 || registerNumber > 15) {
            console.log('Invalid V register');
            return;
        }

        this._V[registerNumber] = value;
    }

    getVRegister(registerNumber: number): number {
        if(registerNumber < 0 || registerNumber > 15) {
            console.log('Invalid V register');
            return;
        }

        return this._V[registerNumber];
    }
}