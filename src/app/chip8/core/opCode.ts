
import * as IS from './instructionSet';
import { Chip8Core } from './chip8Core';

interface IExecutable<T> {
    execute: (core: T) => void;
}

export class OpCode implements IExecutable<Chip8Core>{

    private _firstByte: number;

    private _secondByte: number;

    public execute: (core: Chip8Core) => void;

    public opCodeString: string;

    public opCodeDescription: string;

    get opCode(): string {
        let firstByte: string = this._firstByte.toString(16);
        let secondByte: string = this._secondByte.toString(16);

        if(firstByte.length == 1) {
            firstByte = '0' + firstByte;
        }

        if(secondByte.length == 1) {
            secondByte = '0' + secondByte;
        }

        return (firstByte + secondByte).toUpperCase();
    }

    set opCode(value: string) {
        this.execute = this.getOpCodeFunction(value);
        this._firstByte = parseInt(value.substring(0, 2), 16);
        this._secondByte = parseInt(value.substring(2), 16);
    }

    constructor(firstByte: number, secondByte: number) {
        this._firstByte = firstByte;
        this._secondByte = secondByte;
        this.execute = this.getOpCodeFunction(this.opCode);
    }

    private getOpCodeFunction(insturction: string): (core: Chip8Core) => void {
        const N = parseInt(insturction.substring(3), 16);
        const NN = parseInt(insturction.substring(2), 16);
        const NNN = parseInt(insturction.substring(1), 16);
        const hexN = insturction.substring(3);
        const hexNN = insturction.substring(2);
        const hexNNN = insturction.substring(1);
        const x = parseInt(insturction[1], 16);
        const hexX = insturction[1];
        const y = parseInt(insturction[2], 16);
        const hexY = insturction[2];
        switch (insturction[0]) {
            case '0':
                switch(hexNNN) {
                    case '0E0':
                        this.opCodeString = `CLS`;
                        this.opCodeDescription = 'clear display';
                        return (core: Chip8Core) => {
                            IS.clearDisplay(core);
                        };
                    case '0EE':
                        this.opCodeString = `RET`;
                        this.opCodeDescription = 'return from subroutine';
                        return (core: Chip8Core) => {
                            IS.returnProc(core);
                        };
                    case '000':
                        this.opCodeString = `NOP`;
                        this.opCodeDescription = 'no operation';
                        return (core: Chip8Core) => {
                            IS.noOperation(core);
                        };
                    default:
                        return null;
                };
            case '1':
                this.opCodeString = `JP ${hexNNN}`;
                this.opCodeDescription = 'jump to NNN';
                return (core: Chip8Core) => {
                    IS.jump(core, NNN);
                };
            case '2':
                this.opCodeString = `CALL ${hexNNN}`;
                this.opCodeDescription = 'call subroutine at NNN';
                return (core: Chip8Core) => {
                    IS.call(core, NNN);
                };
            case '3':
                this.opCodeString = `SE v[${hexX}], ${hexNN}`;
                this.opCodeDescription = 'skip if Vx == NN';
                return (core: Chip8Core) => {
                    IS.skipIfVxEqualsNN(core, x, NN);
                };
            case '4':
                this.opCodeString = `SNE v[${hexX}], ${hexNN}`;
                this.opCodeDescription = 'skip if Vx != NN';
                return (core: Chip8Core) => {
                    IS.skipIfVxNotEqualsNN(core, x, NN);
                };
            case '5':
                this.opCodeString = `SE v[${hexX}], v[${hexY}]`;
                this.opCodeDescription = 'skip if Vx == Vy';
                return (core: Chip8Core) => {
                    IS.skipIfVxEqualsVy(core, x, y);
                };
            case '6':
                this.opCodeString = `LD v[${hexX}], ${hexNN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.setVxTo(core, x, NN);
                };
            case '7':
                this.opCodeString = `ADD v[${hexX}], ${hexNN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.incrementVxBy(core, x, NN);
                };
            case '8':
                switch(insturction[3]) {
                    case '0':
                        this.opCodeString = `LD v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVy(core, x, y);
                        };
                    case '1':
                        this.opCodeString = `OR v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxOrVy(core, x, y);
                        };
                    case '2':
                        this.opCodeString = `AND v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxAndVy(core, x, y);
                        };
                    case '3':
                        this.opCodeString = `XOR v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxXorVy(core, x, y);
                        };
                    case '4':
                        this.opCodeString = `ADD v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxPlusVy(core, x, y);
                        };
                    case '5':
                        this.opCodeString = `SUB v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxMinusVy(core, x, y);
                        };
                    case '6':
                        this.opCodeString = `SHR v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxToVyShiftedRight(core, x, y);
                        };
                    case '7':
                        this.opCodeString = `SUBN v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxMinusVy(core, y, x);
                        };
                    case 'E':
                        this.opCodeString = `SHL v[${hexX}], v[${hexY}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxToVyShiftedLeft(core, x, y);
                        };
                    default:
                        return null;
                };
            case '9':
                this.opCodeString = `SNE v[${hexX}], v[${hexY}]`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.skipIfVxNotEqualsVy(core, x, y);
                };
            case 'A':
                this.opCodeString = `LD I, ${hexNN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.setI(core, NNN);
                };
            case 'B':
                this.opCodeString = `JP v0, ${hexNNN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.setProgramCounterToV0PlusNNN(core, NNN);
                };
            case 'C':
                this.opCodeString = `RND v[${hexX}], ${hexNN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.setVxToRandom(core, x, NN);
                };
            case 'D':
                this.opCodeString = `DRW v[${hexX}], v[${hexY}], ${hexN}`;
                this.opCodeDescription = '';
                return (core: Chip8Core) => {
                    IS.drawNofSpriteAtXY(core, x, y, N);
                };
            case 'E':
                switch(hexNN) {
                    case '9E':
                        this.opCodeString = `SKP v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.skipIfKeyInVxIsSet(core, x);
                        };
                    case 'A1':
                        this.opCodeString = `SKNP v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.skipIfKeyInVxIsNotSet(core, x);
                        };
                    default:
                        return null;
                };
            case 'F':
                switch(hexNN) {
                    case '07':
                        this.opCodeString = `LD v[${hexX}], DT`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setVxEqualToDelayTimer(core, x);
                        };
                    case '0A':
                        this.opCodeString = `LD v[${hexX}], K`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.waitForInput(core, x);
                        };
                    case '15':
                        this.opCodeString = `LD DT, v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setDelayTimerEqualToVx(core, x);
                        };
                    case '18':
                        this.opCodeString = `LD ST, v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setSoundTimerEqualToVx(core, x);
                        };
                    case '1E':
                        this.opCodeString = `ADD I, v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setIEqualToIPlusVx(core, x);
                        };
                    case '29':
                        this.opCodeString = `LD F, v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.setIEqualToVxSpriteAddress(core, x);
                        };
                    case '33':
                        this.opCodeString = `LD B, v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.storeVxAsBinaryCodedDecimalInMemory(core, x);
                        };
                    case '55':
                        this.opCodeString = `LD [I], v[${hexX}]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.storeRegistersUpToVxInMemory(core, x);
                        };
                    case '65':
                        this.opCodeString = `LD v[${hexX}], [I]`;
                        this.opCodeDescription = '';
                        return (core: Chip8Core) => {
                            IS.loadRegistersUpToVxFromMemeory(core, x);
                        };
                    default:
                        return null;
                };
            default:
                return null;
        }
    }
}