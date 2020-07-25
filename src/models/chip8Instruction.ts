export class Chip8Instruction {
    instruction: number[];

    constructor(rawInustruction: string) {
        this.instruction = [];
        // console.log(rawInustruction);
        this.instruction[0] = parseInt(rawInustruction.slice(0, 4))
        this.instruction[1] = parseInt(rawInustruction.slice(4, 8))
        this.instruction[2] = parseInt(rawInustruction.slice(8, 12))
        this.instruction[3] = parseInt(rawInustruction.slice(12, 16))
    }
}