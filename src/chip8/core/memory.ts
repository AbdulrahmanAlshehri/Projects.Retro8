import { OpCode } from './opCode';


export class Memory {

    private _memory: Uint8Array;

    private MEMORY_SIZE: number = 4069;

    private PROGRAM_START_ADDRESS = 512;

    private FONT_SET: Uint8Array;

    constructor() {
        this.loadFontSet().then(_ => {
            this.clearMemory();
        });
    }

    clearMemory() {
        this._memory = new Uint8Array(this.MEMORY_SIZE);
        this._memory.set(this.FONT_SET, 0);
    }

    loadRom(rom: Uint8Array) {
        this._memory.set(rom, this.PROGRAM_START_ADDRESS);
    }

    getOpCodeAt(address: number): OpCode {
        let firstByte: number = this._memory[address];
        let secondByte: number = this._memory[address+1];

        return new OpCode(firstByte, secondByte);
    }

    getValueAt(address: number): number {
        return this._memory[address];
    }

    setValueAt(address: number, value: number): void {
        this._memory[address] = value;
    }
    
    async loadFontSet() {
        const fontset = await fetch('assets/FONTSET.chip8').then(res => {
            return res.arrayBuffer()
        });
        this.FONT_SET = new Uint8Array(fontset);
    }
}