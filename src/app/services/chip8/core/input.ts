export class Input {

    private _input: number[];

    private KEYS_COUNT = 16
    
    constructor() {
        this._input = new Array<number>(this.KEYS_COUNT);
        this.initInput();
    }

    initInput(): void {
        for(let i =0; i < this.KEYS_COUNT; i++) {
            this._input[i] = 0;
        }
    }

    setKey(key: number): void {
        this._input[key] = 1;
    }

    unsetKey(key: number): void {
        this._input[key] = 0;
    }

    getKey(key: number): number {
        return this._input[key]
    }
}