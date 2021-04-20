import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';
import { Audio } from './audio';

import { OpCode } from './opCode';

export class Chip8Core {

    public memory = new Memory();
    public registers = new Registers();
    public stack = new Stack();
    public frameBuffer = new FrameBuffer();
    public audio = new Audio();
    public input = new Input();
    public programCounter: number = 512;

    public isRomLoaded: boolean = false;

    public isHalted: boolean = false;

    public tempVNum: number;

    constructor() {
    }

    insertRom(rom: Uint8Array) {
        this.memory.loadRom(rom);
        this.isRomLoaded = true;
    }

    incrementProgramCounter() {
        this.programCounter = (this.programCounter + 2) & 0x0FFF;
    }

    executeCycle() {
        if(!this.isHalted) {
            this.decrementTimers();
            const currentOpCode: OpCode = this.memory.getOpCodeAt(this.programCounter);
            
            currentOpCode.execute(this);

            this.incrementProgramCounter();
        }
    }

    decrementTimers() {
        if(this.registers.delayTimer > 0) {
            this.registers.delayTimer -= 1;
        }

        if(this.registers.soundTimer > 0) {
            this.registers.soundTimer -= 1;
            this.audio.play();
        } else {
            this.audio.stop();
        }
    }

    getFrame() {
        return this.frameBuffer.currentFrame;
    }

    haltForInput(vNum: number) {
        this.tempVNum = vNum;
        this.isHalted = true;
    }

    onKeyDown(keyNumber: number) {
        if(keyNumber < 16) {
            this.input.setKey(keyNumber);
        }

        if(this.isHalted) {
            this.registers.setVRegister(this.tempVNum, keyNumber);
            this.isHalted = false;
        }
    }

    onKeyUp(keyNumber: number) {
        if(keyNumber < 16) {
            this.input.unsetKey(keyNumber);
        }
    }

    disassembleRom(rom: Uint8Array): OpCode[] {
        let opCodesArray: OpCode[] = [];
        for(let i = 0; i < rom.length; i = i +2) {
            opCodesArray.push(new OpCode(rom[i], rom[i+1]));
        }
        return opCodesArray;
    }
}