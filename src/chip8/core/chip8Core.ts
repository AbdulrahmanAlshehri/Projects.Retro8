import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';
import { Audio } from './audio';

import { OpCode } from './opCode';

export class Chip8Core {

    public _memory = new Memory();
    public _registers = new Registers();
    public _stack = new Stack();
    public _frameBuffer = new FrameBuffer();
    public _audio = new Audio();
    public _input = new Input();
    public _programCounter: number = 512;

    public isRomLoaded: boolean = false;

    public isHalted: boolean = false;

    public tempVNum: number;

    constructor() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    insertRom(rom: Uint8Array) {
        this._memory.loadRom(rom);
        this.isRomLoaded = true;
    }

    incrementProgramCounter() {
        this._programCounter = (this._programCounter + 2) & 0x0FFF;
    }

    executeCycle() {
        if(!this.isHalted) {
            this.decrementTimers();
            const currentOpCode: OpCode = this._memory.getOpCodeAt(this._programCounter);
            
            currentOpCode.execute(this);

            this.incrementProgramCounter();
        }
    }

    decrementTimers() {
        if(this._registers.delayTimer > 0) {
            this._registers.delayTimer -= 1;
        }

        if(this._registers.soundTimer > 0) {
            this._registers.soundTimer -= 1;
            this._audio.play();
        } else {
            this._audio.stop();
        }
    }

    getFrame() {
        return this._frameBuffer.currentFrame;
    }

    haltForInput(vNum: number) {
        this.tempVNum = vNum;
        this.isHalted = true;
    }
    
    onKeyDown(e:KeyboardEvent) {
        const keyNumber = parseInt(e.key, 16);
        if(keyNumber < 16) {
            this._input.setKey(keyNumber);
        }

        if(this.isHalted) {
            this._registers.setVRegister(this.tempVNum, keyNumber);
            this.isHalted = false;
        }
    }

    onKeyUp(e: KeyboardEvent) {
        const keyNumber = parseInt(e.key, 16);
        if(keyNumber < 16) {
            this._input.unsetKey(keyNumber);
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