import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';
import { Audio } from './audio';

import * as IS from './instructionSet';

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
            const currentInsturction: string = this._memory.getInstructionAtAddress(this._programCounter);
            const instructionFunction: Function = this.decodeInstruction(currentInsturction);
            instructionFunction();
            this.incrementProgramCounter();
        }
    }

    decrementTimers() {
        if(this._registers.delayRegister > 0) {
            this._registers.delayRegister -= 1;
        }

        if(this._registers.soundRegister > 0) {
            this._registers.soundRegister -= 1;
            this._audio.play();
        } else {
            this._audio.stop();
        }
    }

    decodeInstruction(insturction: string): Function {
        const N = parseInt(insturction.substring(3), 16);
        const NN = parseInt(insturction.substring(2), 16);
        const NNN = parseInt(insturction.substring(1), 16);
        const n2 = insturction.substring(2);
        const n3 = insturction.substring(1);
        const x = parseInt(insturction[1], 16);
        const y = parseInt(insturction[2], 16);
        switch (insturction[0]) {
            case '0':
                switch(n3) {
                    case '0E0':
                        return () => {
                            IS.clearDisplay(this);
                        };
                    case '0EE':
                        return () => {
                            IS.returnProc(this);
                        };
                    case '000':
                        return () => {
                            IS.noOperation(this);
                        };
                    default:
                        return () => {
                            IS.invalidInstruction(this);
                        };
                };
            case '1':
                return () => {
                    IS.jump(this, NNN);
                };
            case '2':
                return () => {
                    IS.call(this, NNN);
                };
            case '3':
                return () => {
                    IS.skipIfVxEqualsNN(this, x, NN);
                };
            case '4':
                return () => {
                    IS.skipIfVxNotEqualsNN(this, x, NN);
                };
            case '5':
                return () => {
                    IS.skipIfVxEqualsVy(this, x, y);
                };
            case '6':
                return () => {
                    IS.setVxTo(this, x, NN);
                };
            case '7':
                return () => {
                    IS.incrementVxBy(this, x, NN);
                };
            case '8':
                switch(insturction[3]) {
                    case '0':
                        return () => {
                            IS.setVxEqualToVy(this, x, y);
                        };
                    case '1':
                        return () => {
                            IS.setVxEqualToVxOrVy(this, x, y);
                        };
                    case '2':
                        return () => {
                            IS.setVxEqualToVxAndVy(this, x, y);
                        };
                    case '3':
                        return () => {
                            IS.setVxEqualToVxXorVy(this, x, y);
                        };
                    case '4':
                        return () => {
                            IS.setVxEqualToVxPlusVy(this, x, y);
                        };
                    case '5':
                        return () => {
                            IS.setVxEqualToVxMinusVy(this, x, y);
                        };
                    case '6':
                        return () => {
                            IS.setVxToVyShiftedRight(this, x, y);
                        };
                    case '7':
                        return () => {
                            IS.setVxEqualToVxMinusVy(this, y, x);
                        };
                    case 'E':
                        return () => {
                            IS.setVxToVyShiftedLeft(this, x, y);
                        };
                    default:
                        return () => {
                            IS.invalidInstruction(this);
                        };
                };
            case '9':
                return () => {
                    IS.skipIfVxNotEqualsVy(this, x, y);
                };
            case 'A':
                return () => {
                    IS.setI(this, NNN);
                };
            case 'B':
                return () => {
                    // console.log(`${insturction}: PC = V0 + 0x${n3}`);
                    IS.setProgramCounterToV0PlusNNN(this, NNN);
                };
            case 'C':
                return () => {
                    IS.setVxToRandom(this, x, NN);
                };
            case 'D':
                return () => {
                    IS.drawNofSpriteAtXY(this, x, y, N);
                };
            case 'E':
                switch(n2) {
                    case '9E':
                        return () => {
                            IS.skipIfKeyInVxIsSet(this, x);
                        };
                    case 'A1':
                        return () => {
                            IS.skipIfKeyInVxIsNotSet(this, x);
                        };
                    default:
                        return () => {
                            IS.invalidInstruction(this);
                        };
                };
            case 'F':
                switch(n2) {
                    case '07':
                        return () => {
                            IS.setVxEqualToDelayTimer(this, x);
                        };
                    case '0A':
                        return () => {
                            IS.waitForInput(this, x);
                        };
                    case '15':
                        return () => {
                            IS.setDelayTimerEqualToVx(this, x);
                        };
                    case '18':
                        return () => {
                            IS.setSoundTimerEqualToVx(this, x);
                        };
                    case '1E':
                        return () => {
                            IS.setIEqualToIPlusVx(this, x);
                        };
                    case '29':
                        return () => {
                            IS.setIEqualToVxSpriteAddress(this, x);
                        };
                    case '33':
                        return () => {
                            IS.storeVxAsBinaryCodedDecimalInMemory(this, x);
                        };
                    case '55':
                        return () => {
                            IS.storeRegistersUpToVxInMemory(this, x);
                        };
                    case '65':
                        return () => {
                            IS.loadRegistersUpToVxFromMemeory(this, x);
                        };
                    default:
                        return () => {
                            IS.invalidInstruction(this);
                        };
                };
            default:
                return () => {
                    IS.invalidInstruction(this);
                };
        }
    }

    getFrame() {
        return this._frameBuffer.currentFrame;
    }

    haltForInput(vNum: number) {
        this.tempVNum = vNum;
        this.isHalted = true;
    }

    setInput(key: number) {
        this._input.setKey(key);
        if(this.isHalted) {
            this.isHalted = false;
        }
    }
    
    onKeyDown(e:KeyboardEvent) {
        const keyNumber = parseInt(e.key, 16);
        if(keyNumber < 16) {
            this.setInput(keyNumber);
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
}