export class Input {

    private _input: number[];

    private KEYS_COUNT = 16
    constructor() {
        this._input = new Array<number>(this.KEYS_COUNT);
        this.initInput();
    }

    initInput() {
        for(let i =0; i < this.KEYS_COUNT; i++) {
            this._input[i] = 0;
        }
    }

    setKeyDown(key: number) {
        this._input[key] = 1;
    }

    setKeyUp(key: number) {
        this._input[key] = 0;
    }
}