import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { FrameBuffer } from './frameBuffer';
import { Input } from './input';
import { Audio } from './audio';

export class Chip8Core {

    private _memory: Memory;
    private _registers: Registers;
    private _stack: Stack;
    private _frameBuffer: FrameBuffer;
    private _audio: Audio;
    private _input: Input;
    private _programCounter: number;
    private PROGRAM_COUNTER_INITIAL_VALUE = 512;

    public isRomLoaded: boolean = false;

    public isHalted: boolean = false;


    constructor() {
        this._memory = new Memory();
        this._registers = new Registers();
        this._stack = new Stack();
        this._frameBuffer = new FrameBuffer();
        this._audio = new Audio();
        this._input = new Input();
        this._programCounter = this.PROGRAM_COUNTER_INITIAL_VALUE;
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
        console.table({
            i1: i1.toString(16),
            i2: i2.toString(16),
            i3: i3.toString(16),
            x: x.toString(16),
            y: y.toString(16),
            PC: this._programCounter.toString(16),
            instruction: insturction,
            V0: this._registers.getVRegister(0).toString(16),
            V1: this._registers.getVRegister(1).toString(16),
            V2: this._registers.getVRegister(2).toString(16),
            V3: this._registers.getVRegister(3).toString(16),
            V4: this._registers.getVRegister(4).toString(16),
            V5: this._registers.getVRegister(5).toString(16),
            V6: this._registers.getVRegister(6).toString(16),
            V7: this._registers.getVRegister(7).toString(16),
            V8: this._registers.getVRegister(8).toString(16),
            V9: this._registers.getVRegister(9).toString(16),
            VA: this._registers.getVRegister(10).toString(16),
            VB: this._registers.getVRegister(11).toString(16),
            VC: this._registers.getVRegister(12).toString(16),
            VD: this._registers.getVRegister(13).toString(16),
            VE: this._registers.getVRegister(14).toString(16),
            VF: this._registers.getVRegister(15).toString(16),
            I: this._registers.I.toString(16),
            DT: this._registers.delayRegister.toString(16),
            ST: this._registers.soundRegister.toString(16)
        });
        console.log(this._memory.stringifyMemory());
        switch (insturction[0]) {
            case '0':
                switch(n3){
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
                    this._programCounter = i3 - 2;
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
                    console.log(`${insturction}: Skip if(V[${x}]==0x${n2})`);
                    if(this._registers.getVRegister(x) === i2) {
                        this.incrementProgramCounter()
                    }
                }
                break;
            case '4':
                instructionFunction = () => {
                    console.log(`${insturction}: Skip if(V[${x}]!=0x${n2})`);
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
                    console.log(`${insturction}: Set v[${x}] = 0x${n2}`);
                    this._registers.setVRegister(x, i2);
                }
                break;
            case '7':
                instructionFunction = () => {
                    console.log(`${insturction}: Set v[${x}] += 0x${n2}`);
                    let value = this._registers.getVRegister(x) + i2;
                    this._registers.setVRegister(x, value);
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
                            let value = this._registers.getVRegister(x) + this._registers.getVRegister(y);
                            if(value >= 256) {
                                this._registers.setVRegister(15, 1);
                                value =  value - 255;
                            }
                            this._registers.setVRegister(x, value);
                        }
                        break;
                    case '5':
                        instructionFunction = () => {
                            console.log(`${insturction}: SUB V[${x}] = V[${x}] - V[${y}]`);
                            const vX = this._registers.getVRegister(x);
                            const vY = this._registers.getVRegister(y);
                            const value = vX - vY;

                            if(vX > vY) {
                                this._registers.setVRegister(15, 1);
                            } else {
                                this._registers.setVRegister(15, 0);
                            }

                            this._registers.setVRegister(x, value);
                        }
                        break;
                    case '6':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOP V[${x}] = V[${y}] >> 1`);
                            const vY = this._registers.getVRegister(y);
                            const leastSignificantBit = vY % 2
                            this._registers.setVRegister(15, leastSignificantBit);
                            const res = vY >> 1;
                            this._registers.setVRegister(x, res);
                        }
                        break;
                    case '7':
                        instructionFunction = () => {
                            console.log(`${insturction}: SUB V[${x}] = V[${y}] - V[${x}]`);
                            const vX = this._registers.getVRegister(x);
                            const vY = this._registers.getVRegister(y);
                            const value = vY - vX;

                            if(vY > vX) {
                                this._registers.setVRegister(15, 1);
                            } else {
                                this._registers.setVRegister(15, 0);
                            }

                            this._registers.setVRegister(x, value);
                        }
                        break;
                    case 'E':
                        instructionFunction = () => {
                            console.log(`${insturction}: BitOP V[${x}] = V[${y}] << 1`);
                            const vY = this._registers.getVRegister(y);
                            const mostSignificantBit = vY > 127? 1 : 0;
                            this._registers.setVRegister(15, mostSignificantBit);
                            const res = vY << 1;
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
                    console.log(`${insturction}: Set I = 0x${n3}`);
                    this._registers.I = i3;
                }
                break;
            case 'B':
                instructionFunction = () => {
                    console.log(`${insturction}: PC = V0 + 0x${n3}`);
                    this._programCounter = (this._registers.getVRegister(0) + i3) & 0x0FF;
                }
                break;
            case 'C':
                instructionFunction = () => {
                    console.log(`${insturction}: Rand V[${x}] = rand & 0x${n2}`);
                    this._registers.setVRegister(x, Math.floor(Math.random() * 255) & i2);
                }
                break;
            case 'D':
                instructionFunction = () => {
                    //TODO: fix drawing
                    console.log(`${insturction}: draw(V[${x}],V[${y}], 0x${n1})`);
                    let sprite = new Uint8Array(8);
                    let spriteText = [];
                    for(let i = 0; i < i1; i++) {
                        let byte = this._memory.getValueAt(this._registers.I + i);
                        let byteText = byte.toString(2);
                        while(byteText.length < 8) {
                            byteText = '0' + byteText;
                        }

                        sprite.set([byte], i);
                        spriteText.push(byteText);

                        // console.log(`sprite location:  ${this._registers.I + i}`);
                    }
                    console.log(sprite);
                    console.log(spriteText);
                    this.logMemoryDump();
                    this._frameBuffer.draw(this._registers.getVRegister(x), this._registers.getVRegister(y), sprite, i1)
                }
                break;
            case 'E':
                switch(n2) {
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
                switch(n2) {
                    case '07':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set V[${x}] = delay_timer`);
                            this._registers.setVRegister(x, this._registers.delayRegister);
                        }
                        break;
                    case '0A':
                        instructionFunction = () => {
                            //TODO: halt and wait for input
                            console.log(`${insturction}: Set V[${x}] = key`);
                            console.log('waiting for input');
                            this.isHalted = true;
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
                            this._registers.I = this._registers.getVRegister(x) * 5;
                        }
                        break;
                    case '33':
                        instructionFunction = () => {
                            console.log(`${insturction}: Set BCD(V[${x}])`);
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
                            console.log(`${insturction}: reg_dump(V[${x}],I)`);
                            for(let i = 0; i <= x; i++) {
                                this._memory.setValueAt(this._registers.I + i, this._registers.getVRegister(i));
                            }
                            this._registers.I += x+ 1;
                        }
                        break;
                    case '65':
                        instructionFunction = () => {
                            console.log(`${insturction}: reg_load(V[${x}],I)`);
                            for(let i = 0; i <= x; i++) {
                                const address = this._registers.I + i;
                                const memoryValue = this._memory.getValueAt(address);
                                this._registers.setVRegister(i, memoryValue);

                                // console.log(`set v[${i}] = ${memoryValue.toString(16)} taken from address = ${address}`);
                            }
                            this._registers.I += x+ 1;
                            // console.log(this._memory.stringifyMemory());
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

        console.log(instructionFunction);

        return instructionFunction;
    }

    getFrame() {
        return this._frameBuffer.currentFrame;
    }

    logMemoryDump() {
        console.log(this._memory.stringifyMemory());
    }

    setInput(key: number) {
        this._input.setKey(key);
        if(this.isHalted) {
            this.isHalted = false;
        }
    }
}