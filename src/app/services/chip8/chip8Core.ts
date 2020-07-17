import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';

export class Chip8Core {

    private _memory: Memory;
    private _registers: Registers;
    private _stack: Stack;
    private _frameBuffer: FrameBuffer;


    constructor() {
        this._memory = new Memory();
        this._registers = new Registers();
        this._stack = new Stack();
        this._frameBuffer = new FrameBuffer();
    }

    insertRom(rom: Uint8Array) {
        this._memory.loadRom(rom);
      }
}