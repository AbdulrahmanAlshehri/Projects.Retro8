import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';
import { Audio } from './audio';

import * as IS from './instructionSet';

export class Chip8Core {

    public _memory: Memory;
    public _registers: Registers;
    public _stack: Stack;
    public frameBuffer: FrameBuffer;
    public _audio: Audio;
    public _input: Input;
    public _programCounter: number;
    private PROGRAM_COUNTER_INITIAL_VALUE = 512;

    public isRomLoaded: boolean = false;

    public isHalted: boolean = false;

    public tempVNum: number;

    constructor() {
        this._memory = new Memory();
        this._registers = new Registers();
        this._stack = new Stack();
        this.frameBuffer = new FrameBuffer();
        this._audio = new Audio();
        this._input = new Input();
        this._programCounter = this.PROGRAM_COUNTER_INITIAL_VALUE;
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

            if(this._registers.soundRegister > 0) {
                this._audio.play();
            } else {
                this._audio.stop();
            }
            this.incrementProgramCounter();
        }
    }

    decrementTimers() {
        if(this._registers.delayRegister > 0) {
            this._registers.delayRegister -= 1;
        }
        if(this._registers.soundRegister > 0) {
            this._registers.soundRegister -= 1;
        }
    }
    decodeInstruction(insturction: string): Function {
        let instructionFunction: Function;
        const i1 = parseInt(insturction.substring(3), 16);
        const i2 = parseInt(insturction.substring(2), 16);
        const i3 = parseInt(insturction.substring(1), 16);
        const n1 = insturction.substring(3);
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
                    IS.jump(this, i3);
                };
            case '2':
                return () => {
                    IS.call(this, i3);
                };
            case '3':
                return () => {
                    IS.skipIfVxEqualsNN(this, x, i2);
                };
            case '4':
                return () => {
                    IS.skipIfVxNotEqualsNN(this, x, i2);
                };
            case '5':
                return () => {
                    IS.skipIfVxEqualsVy(this, x, y);
                };
            case '6':
                return () => {
                    IS.setVxTo(this, x, i2);
                };
            case '7':
                return () => {
                    IS.incrementVxBy(this, x, i2);
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
                            // console.log(`${insturction}: BitOP V[${x}] = V[${y}] << 1`);
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
                    IS.setI(this, i3);
                };
            case 'B':
                return () => {
                    // console.log(`${insturction}: PC = V0 + 0x${n3}`);
                    IS.setProgramCounterToV0PlusNNN(this, i3);
                };
            case 'C':
                return () => {
                    IS.setVxToRandom(this, x);
                };
            case 'D':
                return () => {
                    IS.drawNofSpriteAtXY(this, x, y, i1);
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
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set V[${x}] = delay_timer`);
                            this._registers.setVRegister(x, this._registers.delayRegister);
                        }
                        break;
                    case '0A':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set V[${x}] = key`);
                            this.haltForInput(x);
                            // console.log('waiting for input');
                        }
                        break;
                    case '15':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set delay_timer = V[${x}]`);
                            this._registers.delayRegister = this._registers.getVRegister(x);
                        }
                        break;
                    case '18':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set sound_timer = V[${x}]`);
                            this._registers.soundRegister = this._registers.getVRegister(x);

                        }
                        break;
                    case '1E':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set I += V[${x}]`);
                            this._registers.I += this._registers.getVRegister(x);
                        }
                        break;
                    case '29':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set I = sprite_addr[V[${x}]]`);
                            this._registers.I = this._registers.getVRegister(x) * 5;
                        }
                        break;
                    case '33':
                        instructionFunction = () => {
                            // console.log(`${insturction}: Set BCD(V[${x}])`);
                            const vX: number = this._registers.getVRegister(x);
                            let binaryString = vX.toString(10);
                            while(binaryString.length < 3) {
                                binaryString = '0' + binaryString;
                            }
                            for(let i = 0; i < binaryString.length; i++) {
                                const currentAddress = this._registers.I + i;
                                this._memory.setValueAt(currentAddress, parseInt(binaryString[i]));
                            }
                        }
                        break;
                    case '55':
                        instructionFunction = () => {
                            // console.log(`${insturction}: reg_dump(V[${x}],I)`);
                            for(let i = 0; i <= x; i++) {
                                this._memory.setValueAt(this._registers.I + i, this._registers.getVRegister(i));
                            }
                            this._registers.I += x+ 1;
                        }
                        break;
                    case '65':
                        instructionFunction = () => {
                            // console.log(`${insturction}: reg_load(V[${x}],I)`);
                            for(let i = 0; i <= x; i++) {
                                const address = this._registers.I + i;
                                const memoryValue = this._memory.getValueAt(address);
                                this._registers.setVRegister(i, memoryValue);

                            }
                            this._registers.I += x+ 1;
                        }
                        break;
                    default:
                        instructionFunction = () => {
                            // console.log(`${insturction} is not defined`);
                        }
                }
                break;
            default:
                instructionFunction = () => {
                    // console.log(`${insturction} is not defined`);
                }
        }

        return instructionFunction;
    }

    getFrame() {
        return this.frameBuffer.currentFrame;
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

    haltForInput(vNum: number) {
        this.tempVNum = vNum;
        this.isHalted = true;
    }
}