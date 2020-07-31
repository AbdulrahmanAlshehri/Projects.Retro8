
import * as IS from './instructionSet';
import { Chip8Core } from './chip8Core';

interface IExecutable<T> {
    execute: (core: T) => void;
}

export class OpCode implements IExecutable<Chip8Core>{

    private _firstByte: number;

    private _secondByte: number;

    public execute: (core: Chip8Core) => void;

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
        const n2 = insturction.substring(2);
        const n3 = insturction.substring(1);
        const x = parseInt(insturction[1], 16);
        const y = parseInt(insturction[2], 16);
        switch (insturction[0]) {
            case '0':
                switch(n3) {
                    case '0E0':
                        return (core: Chip8Core) => {
                            IS.clearDisplay(core);
                        };
                    case '0EE':
                        return (core: Chip8Core) => {
                            IS.returnProc(core);
                        };
                    case '000':
                        return (core: Chip8Core) => {
                            IS.noOperation(core);
                        };
                    default:
                        return null;
                };
            case '1':
                return (core: Chip8Core) => {
                    IS.jump(core, NNN);
                };
            case '2':
                return (core: Chip8Core) => {
                    IS.call(core, NNN);
                };
            case '3':
                return (core: Chip8Core) => {
                    IS.skipIfVxEqualsNN(core, x, NN);
                };
            case '4':
                return (core: Chip8Core) => {
                    IS.skipIfVxNotEqualsNN(core, x, NN);
                };
            case '5':
                return (core: Chip8Core) => {
                    IS.skipIfVxEqualsVy(core, x, y);
                };
            case '6':
                return (core: Chip8Core) => {
                    IS.setVxTo(core, x, NN);
                };
            case '7':
                return (core: Chip8Core) => {
                    IS.incrementVxBy(core, x, NN);
                };
            case '8':
                switch(insturction[3]) {
                    case '0':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVy(core, x, y);
                        };
                    case '1':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxOrVy(core, x, y);
                        };
                    case '2':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxAndVy(core, x, y);
                        };
                    case '3':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxXorVy(core, x, y);
                        };
                    case '4':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxPlusVy(core, x, y);
                        };
                    case '5':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxMinusVy(core, x, y);
                        };
                    case '6':
                        return (core: Chip8Core) => {
                            IS.setVxToVyShiftedRight(core, x, y);
                        };
                    case '7':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToVxMinusVy(core, y, x);
                        };
                    case 'E':
                        return (core: Chip8Core) => {
                            IS.setVxToVyShiftedLeft(core, x, y);
                        };
                    default:
                        return null;
                };
            case '9':
                return (core: Chip8Core) => {
                    IS.skipIfVxNotEqualsVy(core, x, y);
                };
            case 'A':
                return (core: Chip8Core) => {
                    IS.setI(core, NNN);
                };
            case 'B':
                return (core: Chip8Core) => {
                    IS.setProgramCounterToV0PlusNNN(core, NNN);
                };
            case 'C':
                return (core: Chip8Core) => {
                    IS.setVxToRandom(core, x, NN);
                };
            case 'D':
                return (core: Chip8Core) => {
                    IS.drawNofSpriteAtXY(core, x, y, N);
                };
            case 'E':
                switch(n2) {
                    case '9E':
                        return (core: Chip8Core) => {
                            IS.skipIfKeyInVxIsSet(core, x);
                        };
                    case 'A1':
                        return (core: Chip8Core) => {
                            IS.skipIfKeyInVxIsNotSet(core, x);
                        };
                    default:
                        return null;
                };
            case 'F':
                switch(n2) {
                    case '07':
                        return (core: Chip8Core) => {
                            IS.setVxEqualToDelayTimer(core, x);
                        };
                    case '0A':
                        return (core: Chip8Core) => {
                            IS.waitForInput(core, x);
                        };
                    case '15':
                        return (core: Chip8Core) => {
                            IS.setDelayTimerEqualToVx(core, x);
                        };
                    case '18':
                        return (core: Chip8Core) => {
                            IS.setSoundTimerEqualToVx(core, x);
                        };
                    case '1E':
                        return (core: Chip8Core) => {
                            IS.setIEqualToIPlusVx(core, x);
                        };
                    case '29':
                        return (core: Chip8Core) => {
                            IS.setIEqualToVxSpriteAddress(core, x);
                        };
                    case '33':
                        return (core: Chip8Core) => {
                            IS.storeVxAsBinaryCodedDecimalInMemory(core, x);
                        };
                    case '55':
                        return (core: Chip8Core) => {
                            IS.storeRegistersUpToVxInMemory(core, x);
                        };
                    case '65':
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