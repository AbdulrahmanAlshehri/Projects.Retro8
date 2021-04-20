import { Chip8Core } from './chip8Core';

export function clearDisplay(core: Chip8Core): void {
    core.frameBuffer.clearFrameBuffer();
}

export function returnProc(core: Chip8Core): void {
        core.programCounter = core.stack.pop();
}

export function noOperation(core: Chip8Core): void {
    return
}
export function invalidInstruction(core: Chip8Core): void {
    return;
}

export function jump(core: Chip8Core, address: number): void {
    core.programCounter = address - 2;
}

export function call(core: Chip8Core, address: number): void {
    core.stack.push(core.programCounter);
    core.programCounter = address - 2;
}

export function skipIfVxEqualsNN(core: Chip8Core, x: number, NN: number): void {
    if(core.registers.getVRegister(x) === NN) {
        core.incrementProgramCounter()
    }
}

export function skipIfVxNotEqualsNN(core: Chip8Core, x: number, NN: number): void {
    if(core.registers.getVRegister(x) !== NN) {
        core.incrementProgramCounter();
    }
}

export function skipIfVxEqualsVy(core: Chip8Core, x: number, y: number): void {
    if(core.registers.getVRegister(x) === core.registers.getVRegister(y)) {
        core.incrementProgramCounter();
    }
}

export function skipIfVxNotEqualsVy(core: Chip8Core, x: number, y: number): void {
    if(core.registers.getVRegister(x) !== core.registers.getVRegister(y)) {
        core.incrementProgramCounter();
    }
}


export function setVxTo(core: Chip8Core, x: number, NN: number): void {
    core.registers.setVRegister(x, NN);
}

export function incrementVxBy(core: Chip8Core, x: number, NN: number): void {
    let value = core.registers.getVRegister(x) + NN;
    core.registers.setVRegister(x, value);
}

export function setVxEqualToVy(core: Chip8Core, x: number, y: number): void {
    core.registers.setVRegister(x, core.registers.getVRegister(y));
}

export function setVxEqualToVxOrVy(core: Chip8Core, x: number, y: number): void {
    const res = core.registers.getVRegister(x) | core.registers.getVRegister(y);
    core.registers.setVRegister(x, res);
}

export function setVxEqualToVxAndVy(core: Chip8Core, x: number, y: number): void {
    const res = core.registers.getVRegister(x) & core.registers.getVRegister(y);
    core.registers.setVRegister(x, res);
}

export function setVxEqualToVxXorVy(core: Chip8Core, x: number, y: number): void {
    const res = core.registers.getVRegister(x) ^ core.registers.getVRegister(y);
    core.registers.setVRegister(x, res);
}

export function setVxEqualToVxPlusVy(core: Chip8Core, x: number, y: number): void {
    let value = core.registers.getVRegister(x) + core.registers.getVRegister(y);
    
    if(value > 255) {
        core.registers.setVRegister(15, 1);
    }

    core.registers.setVRegister(x, value);
}

export function setVxEqualToVxMinusVy(core: Chip8Core, x: number, y: number): void {
    const vX = core.registers.getVRegister(x);
    const vY = core.registers.getVRegister(y);
    const value = vX - vY;

    if(vX > vY) {
        core.registers.setVRegister(15, 1);
    } else {
        core.registers.setVRegister(15, 0);
    }

    core.registers.setVRegister(x, value);
}

export function setVxToVyShiftedRight(core: Chip8Core, x: number, y: number): void {
    const vY = core.registers.getVRegister(y);
    const leastSignificantBit = vY % 2
    core.registers.setVRegister(15, leastSignificantBit);
    const res = vY >> 1;
    core.registers.setVRegister(x, res);
}


export function setVxToVyShiftedLeft(core: Chip8Core, x: number, y: number): void {
    const vY = core.registers.getVRegister(y);
    const mostSignificantBit = vY > 127? 1 : 0;
    core.registers.setVRegister(15, mostSignificantBit);
    const res = vY << 1;
    core.registers.setVRegister(x, res);
}

export function setI(core: Chip8Core, NNN: number): void {
    core.registers.I = NNN;
}

export function setIEqualToIPlusVx(core: Chip8Core, x: number): void {
    core.registers.I += core.registers.getVRegister(x);
}

export function setIEqualToVxSpriteAddress(core: Chip8Core, x: number): void {
    core.registers.I = core.registers.getVRegister(x) * 5;
}

export function setProgramCounterToV0PlusNNN(core: Chip8Core, NNN: number): void {
    core.programCounter = (core.registers.getVRegister(0) + NNN) & 0x0FF;
}

export function setVxToRandom(core: Chip8Core, x: number, NN: number) {
    core.registers.setVRegister(x, Math.floor(Math.random() * 255) & NN);

}

export function drawNofSpriteAtXY(core: Chip8Core, x: number, y: number, N: number): void {
    let sprite = new Uint8Array(8);

    for(let i = 0; i < N; i++) {
        let byte = core.memory.getValueAt(core.registers.I + i);
        let byteText = byte.toString(2);
        while(byteText.length < 8) {
            byteText = '0' + byteText;
        }
        sprite.set([byte], i);
    }

    let collision = core.frameBuffer.draw(core.registers.getVRegister(x), core.registers.getVRegister(y), sprite, N);

    if(collision) {
        core.registers.setVRegister(15, 1);
    }
    else {
        core.registers.setVRegister(15, 0);
    }
}

export function skipIfKeyInVxIsSet(core: Chip8Core, x: number): void {
    if(core.input.getKey(core.registers.getVRegister(x)) === 1) {
        core.incrementProgramCounter();
    }
}

export function skipIfKeyInVxIsNotSet(core: Chip8Core, x: number): void {
    if(core.input.getKey(core.registers.getVRegister(x)) !== 1) {
        core.incrementProgramCounter();
    }
}

export function setVxEqualToDelayTimer(core: Chip8Core, x: number): void {
    core.registers.setVRegister(x, core.registers.delayTimer);
}

export function setDelayTimerEqualToVx(core: Chip8Core, x: number): void {
    core.registers.delayTimer = core.registers.getVRegister(x);
}

export function setSoundTimerEqualToVx(core: Chip8Core, x: number): void {
    core.registers.soundTimer = core.registers.getVRegister(x);
}

export function storeVxAsBinaryCodedDecimalInMemory(core: Chip8Core, x: number): void {
    const vX: number = core.registers.getVRegister(x);
    let binaryString = vX.toString(10);
    while(binaryString.length < 3) {
        binaryString = '0' + binaryString;
    }
    for(let i = 0; i < binaryString.length; i++) {
        const currentAddress = core.registers.I + i;
        core.memory.setValueAt(currentAddress, parseInt(binaryString[i]));
    }
}

export function storeRegistersUpToVxInMemory(core: Chip8Core, x: number): void {
    for(let i = 0; i <= x; i++) {
        core.memory.setValueAt(core.registers.I + i, core.registers.getVRegister(i));
    }
    core.registers.I += x+ 1;
}

export function loadRegistersUpToVxFromMemeory(core: Chip8Core, x: number): void {
    for(let i = 0; i <= x; i++) {
        const address = core.registers.I + i;
        const memoryValue = core.memory.getValueAt(address);
        core.registers.setVRegister(i, memoryValue);

    }
    core.registers.I += x+ 1;
}

export function waitForInput(core: Chip8Core, x: number): void {
    core.haltForInput(x);
}