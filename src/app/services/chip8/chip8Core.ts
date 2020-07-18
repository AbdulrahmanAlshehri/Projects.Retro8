import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';

export class Chip8Core {

    private _memory: Memory;
    private _registers: Registers;
    private _stack: Stack;
    private _frameBuffer: FrameBuffer;
    private _input: Input;
    private _programCounter: number;
    private PROGRAM_COUNTER_INITIAL_VALUE = 512;


    constructor() {
        this._memory = new Memory();
        this._registers = new Registers();
        this._stack = new Stack();
        this._frameBuffer = new FrameBuffer();
        this._input = new Input();
        this._programCounter = this.PROGRAM_COUNTER_INITIAL_VALUE;
    }

    insertRom(rom: Uint8Array) {
        this._memory.loadRom(rom);
    }

    incrementProgramCounter() {
        this._programCounter = this._programCounter + 2;
    }

    execute_cycle() {
        const currentInsturction: string = this._memory.getInstructionAtAddress(this._programCounter);

        const instructionFunction: Function = this.decodeInstruction(currentInsturction);

        instructionFunction();
        this.incrementProgramCounter();
    }

    decodeInstruction(insturction: string): Function {
        let instructionFunction: Function;
        let i1 = parseInt(insturction.substring(3), 16);
        let i2 = parseInt(insturction.substring(2), 16);
        let i3 = parseInt(insturction.substring(1), 16);
        let x = parseInt(insturction[1], 16);
        let y = parseInt(insturction[2], 16);
        console.table({i1: i1,i2: i2,i3: i3,x: x,y: y, PC: this._programCounter, instruction: insturction});
        switch (insturction[0]) {
            case '0':
                switch(i3.toString(16).toUpperCase()){
                    case '0E0':
                        instructionFunction = () => {
                            console.log(`${insturction}: clear`);
                            this._frameBuffer.clearFrameBuffer();
                        }
                        break;
                    case '0EE':
                        instructionFunction = () => {
                            console.log(`${insturction}: return;`);
                            this._programCounter = this._stack.pop();
                        }
                        break;
                    case '000':
                        instructionFunction = () => {
                            console.log(`${insturction}: Nop`);
                        }
                        break;
                    default:
                        instructionFunction = () => {
                            console.log(`${insturction}: Call RCA ${i3}`);
                        }
                        break;
                }
                break;
            case '1':
                instructionFunction = () => {
                    console.log(`${insturction}: Jump $${i3}`);
                    this._programCounter = i3;
                }
                break;
            case '2':
                instructionFunction = () => {
                    console.log(`${insturction}: Call $${i3}`);
                    this._stack.push(this._programCounter);
                    this._programCounter = i3;
                }
                break;
            case '3':
                instructionFunction = () => {
                    console.log(`${insturction}: Skip if(V[${x}]==0x${i2})`);
                    if(this._registers.getVRegister(x) === i2) {
                        this.incrementProgramCounter()
                    }
                }
                break;
            case '4':
                instructionFunction = () => {
                    console.log(`${insturction}: Skip if(V[${x}]!=0x${i2})`);
                    if(this._registers.getVRegister(x) !== i2) {
                        this.incrementProgramCounter();
                    }
                }
                break;
            case '5':
                instructionFunction = () => {
                    console.log(`${insturction}: Skip if(V[${x}]==V[${y})]`);
                    if(this._registers.getVRegister(x) === this._registers.getVRegister(y)) {
                        this.incrementProgramCounter();
                    }
                }
                break;
            case '6':
                instructionFunction = () => {
                    console.log(`${insturction}: Set v[${x}] = 0x${i2}`);
                    this._registers.setVRegister(y, i2);
                }
                break;
            case '7':
                instructionFunction = () => {
                    console.log(`${insturction}: Set v[${x}] += 0x${i2}`);
                    this._registers.setVRegister(x, this._registers.getVRegister(x + i2));
                }
                break;
            case '8':
                switch(insturction[3]){
                    case '0':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set V[${x}]=V[${y}`);
                            this._registers.setVRegister(x, this._registers.getVRegister(y));
                        }
                        break;
                    case '1':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOp V[${x}] = V[${x}] OR V[${y}`);
                            const res = this._registers.getVRegister(x) | this._registers.getVRegister(y);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '2':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOp V[${x}] = V[${x}] AND V[${y}`);
                            const res = this._registers.getVRegister(x) & this._registers.getVRegister(y);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '3':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOp V[${x}] = V[${x}] XOR V[${y}`);
                            const res = this._registers.getVRegister(x) ^ this._registers.getVRegister(y);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '4':
                        instructionFunction = () => {
                            console.log(`${insturction}: ADD V[${x}] = V[${x}] + V[${y}]`);
                            const res = this._registers.getVRegister(x) + this._registers.getVRegister(y);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '5':
                        instructionFunction = () => {
                            console.log(`${insturction}: SUB V[${x}] = V[${y}] - V[${x}]`);
                            const res = this._registers.getVRegister(y) - this._registers.getVRegister(x);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '6':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOP V[${x}] = V[${y}] >> 1`);
                            const res = this._registers.getVRegister(y) >> 1;
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '7':
                        instructionFunction = () => {
                            console.log(`${insturction}: SUB V[${x}] = V[${y}] - V[${x}]`);
                            const res = this._registers.getVRegister(y) - this._registers.getVRegister(x);
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case 'E':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOP V[${x}] = V[${y}] << 1`);
                            const res = this._registers.getVRegister(x) << 1;
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    default:
                        instructionFunction = () => {
                            console.log(`${insturction} is not defined`);
                        }
                }
                break;
            case '9':
                instructionFunction = () => {
                    console.log(`${insturction}: Skip if(V[${x}] != v[${y}])`);
                    if(this._registers.getVRegister(x) !== this._registers.getVRegister(y)) {
                        this.incrementProgramCounter();
                    }
                }
                break;
            case 'A':
                instructionFunction = () => {
                    console.log(`${insturction}: Set I = 0x${i3}`);
                    this._registers.I = i3;
                }
                break;
            case 'B':
                instructionFunction = () => {
                    console.log(`${insturction}: PC = V0 + 0x${i3}`);
                    this._programCounter = this._registers.getVRegister(0) + i3;
                }
                break;
            case 'C':
                instructionFunction = () => {
                    console.log(`${insturction}: Rand V[${x}] = rand & 0x${i2}`);
                    this._registers.setVRegister(x, Math.floor(Math.random() * 255) & i2);
                }
                break;
            case 'D':
                instructionFunction = () => {
                    //TODO:
                    console.log(`${insturction}: draw(V[${x}],V[${y}], 0x${i1})`);
                    let sprite = new Uint8Array()
                    for(let i = 0; i < i1; i++) {
                        sprite.set([this._memory.getValueAt(this._registers.I)], i);

                    }
                    this._frameBuffer.draw(this._registers.getVRegister(x), this._registers.getVRegister(y), sprite, i1)
                }
                break;
            case 'E':
                switch(i2.toString(16).toUpperCase()) {
                    case '9E':
                        instructionFunction = () => {
                            console.log(`${insturction}: Skip if(key() == v[${x}])`);
                            if(this._input.getKey(this._registers.getVRegister(x)) === 1) {
                                this.incrementProgramCounter();
                            }
                        }
                        break;
                    case 'A1':
                        instructionFunction = () => {
                            console.log(`${insturction}: Skip if(key() != v[${x}])`);
                            if(this._input.getKey(this._registers.getVRegister(x)) !== 1) {
                                this.incrementProgramCounter();
                            }
                        }
                        break;
                    default:
                        instructionFunction = () => {
                            console.log(`${insturction} is not defined`);
                        }
                }
                break;
            case 'F':
                switch(i2.toString().toUpperCase()) {
                    case '07':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set V[${x}] = delay_timer`);
                            this._registers.setVRegister(x, this._registers.delayRegister);
                        }
                        break;
                    case '0A':
                        instructionFunction = () => {
                            //TODO
                            console.log(`${insturction}: Set V[${x}] = key`);
                        }
                        break;
                    case '15':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set delay_timer = V[${x}]`);
                            this._registers.delayRegister = this._registers.getVRegister(x);
                        }
                        break;
                    case '18':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set sound_timer = V[${x}]`);
                            this._registers.soundRegister = this._registers.getVRegister(x);

                        }
                        break;
                    case '1E':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set I += V[${x}]`);
                            this._registers.I += this._registers.getVRegister(x);
                        }
                        break;
                    case '29':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set I = sprite_addr[V[${x}]]`);
                            this._registers.I = this._registers.getVRegister(x * 5);
                        }
                        break;
                    case '33':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set BCD(V[${x}])`);
                        }
                        break;
                    case '55':
                        instructionFunction = () => {
                            console.log(`${insturction}: reg_dump(V[${x}],&I)`);
                            for(let i = 0; i < x; i++) {
                                this._memory.setValueAt(this._registers.I + i, this._registers.getVRegister(i));
                                this._registers.I += x+ 1;
                            }
                        }
                        break;
                    case '65':
                        instructionFunction = () => {
                            console.log(`${insturction}: reg_load(V[${x}],&I)`);
                            for(let i = 0; i < x; i++) {
                                this._registers.setVRegister(i, this._memory.getValueAt(this._registers.I + i));
                                this._registers.I += x+ 1;
                            }
                        }
                        break;
                    default:
                        instructionFunction = () => {
                            console.log(`${insturction} is not defined`);
                        }
                }
                break;
            default:
                instructionFunction = () => {
                    console.log(`${insturction} is not defined`);
                }
        }

        return instructionFunction;
    }

    getFrame() {
        return this._frameBuffer.currentFrame;
    }
}