

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
        
        for(let i = 0; i < this._memory.length; i++) {
           memoryString[i] = this._memory[i].toString(16);
        }

        return memoryString;
    }

    getInstructionAtAddress(address: number): string {
        let firstByte: string = this._memory[address].toString(16);
        let secondByte: string = this._memory[address+1].toString(16);

        if(firstByte.length == 1) {
            firstByte = '0' + firstByte;
        }

        if(secondByte.length == 1) {
            secondByte = '0' + secondByte;
        }

        return (firstByte + secondByte).toUpperCase();
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