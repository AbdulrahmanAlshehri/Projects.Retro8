

export class Memory {

    private _memory: Uint8Array;

    private MEMORY_SIZE: number = 4069;

    private PROGRAM_START_ADDRESS = 512;

    private FONT_SET: Uint8Array;
    constructor() {
        this.loadFontSet().then(_ => {
            this.clearMemory();
            this.initMemory();
        });
    }

    clearMemory() {
        this._memory = new Uint8Array(this.MEMORY_SIZE);
    }

    initMemory() {
        this._memory.set(this.FONT_SET, 0);
    }

    loadRom(rom: Uint8Array) {
        this._memory.set(rom, this.PROGRAM_START_ADDRESS);
        this.stringifyMemory()
    }

    stringifyMemory() {
        let memoryString: string[] = [];
        
        console.log(typeof(this._memory[0]));

        for(let i = 0; i < this._memory.length; i++) {
           memoryString[i] = this._memory[i].toString(16);
        }

        console.log(memoryString);
    }

    async loadFontSet() {
        const fontset = await fetch('assets/FONTSET.chip8').then(res => {
            return res.arrayBuffer()
        });
        this.FONT_SET = new Uint8Array(fontset);
    }
}