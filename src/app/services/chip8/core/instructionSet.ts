import { Chip8Core } from './chip8Core';

// clear screen display
export function clearDisplay(core: Chip8Core): void {
    // console.log(`${insturction}: clear`);
    core.frameBuffer.clearFrameBuffer();
}

// return from function call
export function returnProc(core: Chip8Core): void {
        // console.log(`${insturction}: return;`);
        core._programCounter = core._stack.pop();
}

// NOP
export function noOperation(core: Chip8Core): void {
    return
}
// invalid instruction. to handle such cases
export function invalidInstruction(core: Chip8Core): void {
    return;
}

// Jump to address
export function jump(core: Chip8Core, address: number): void {
    core._programCounter = address - 2;
}

export function call(core: Chip8Core, address: number): void {
    // console.log(`${insturction}: Call $${i3}`);
    core._stack.push(core._programCounter);
    core._programCounter = address;
}

export function skipIfVxEqualsNN(core: Chip8Core, x: number, NN: number): void {
    if(core._registers.getVRegister(x) === NN) {
        core.incrementProgramCounter()
    }
}

export function skipIfVxNotEqualsNN(core: Chip8Core, x: number, NN: number): void {
    if(core._registers.getVRegister(x) !== NN) {
        core.incrementProgramCounter();
    }
}

export function skipIfVxEqualsVy(core: Chip8Core, x: number, y: number): void {
    if(core._registers.getVRegister(x) === core._registers.getVRegister(y)) {
        core.incrementProgramCounter();
    }
}

export function skipIfVxNotEqualsVy(core: Chip8Core, x: number, y: number): void {
    if(core._registers.getVRegister(x) !== core._registers.getVRegister(y)) {
        core.incrementProgramCounter();
    }
}


export function setVxTo(core: Chip8Core, x: number, NN: number): void {
    core._registers.setVRegister(x, NN);
}

export function incrementVxBy(core: Chip8Core, x: number, NN: number): void {
    let value = core._registers.getVRegister(x) + NN;
    core._registers.setVRegister(x, value);
}

export function setVxEqualToVy(core: Chip8Core, x: number, y: number): void {
    core._registers.setVRegister(x, core._registers.getVRegister(y));
}

export function setVxEqualToVxOrVy(core: Chip8Core, x: number, y: number): void {
    const res = core._registers.getVRegister(x) | core._registers.getVRegister(y);
    core._registers.setVRegister(x, res);
}

export function setVxEqualToVxAndVy(core: Chip8Core, x: number, y: number): void {
    const res = core._registers.getVRegister(x) & core._registers.getVRegister(y);
    core._registers.setVRegister(x, res);
}

export function setVxEqualToVxXorVy(core: Chip8Core, x: number, y: number): void {
    const res = core._registers.getVRegister(x) ^ core._registers.getVRegister(y);
    core._registers.setVRegister(x, res);
}

export function setVxEqualToVxPlusVy(core: Chip8Core, x: number, y: number): void {
    let value = core._registers.getVRegister(x) + core._registers.getVRegister(y);
    
    if(value > 255) {
        core._registers.setVRegister(15, 1);
    }

    core._registers.setVRegister(x, value);
}

export function setVxEqualToVxMinusVy(core: Chip8Core, x: number, y: number): void {
    const vX = core._registers.getVRegister(x);
    const vY = core._registers.getVRegister(y);
    const value = vX - vY;

    if(vX > vY) {
        core._registers.setVRegister(15, 1);
    } else {
        core._registers.setVRegister(15, 0);
    }

    core._registers.setVRegister(x, value);
}

export function setVxToVyShiftedRight(core: Chip8Core, x: number, y: number): void {
    const vY = core._registers.getVRegister(y);
    const leastSignificantBit = vY % 2
    core._registers.setVRegister(15, leastSignificantBit);
    const res = vY >> 1;
    core._registers.setVRegister(x, res);
}


export function setVxToVyShiftedLeft(core: Chip8Core, x: number, y: number): void {
    const vY = core._registers.getVRegister(y);
    const mostSignificantBit = vY > 127? 1 : 0;
    core._registers.setVRegister(15, mostSignificantBit);
    const res = vY << 1;
    core._registers.setVRegister(x, res);
}

export function setI(core: Chip8Core, NNN: number): void {
    core._registers.I = NNN;
}

export function setProgramCounterToV0PlusNNN(core: Chip8Core, NNN: number): void {
    core._programCounter = (core._registers.getVRegister(0) + NNN) & 0x0FF;
}

export function setVxToRandom(core: Chip8Core, x: number) {
    core._registers.setVRegister(x, Math.floor(Math.random() * 255) & i2);

}

//TODO: fix glitchy drawing
export function drawNofSpriteAtXY(core: Chip8Core, x: number, y: number, N: number): void {
    let sprite = new Uint8Array(8);

    for(let i = 0; i < N; i++) {
        let byte = core._memory.getValueAt(core._registers.I + i);
        let byteText = byte.toString(2);
        while(byteText.length < 8) {
            byteText = '0' + byteText;
        }
        sprite.set([byte], i);
    }

    let collision = core.frameBuffer.draw(core._registers.getVRegister(x), core._registers.getVRegister(y), sprite, N);

    if(collision) {
        core._registers.setVRegister(15, 1);
    }
    else {
        core._registers.setVRegister(15, 0);
    }
}

export function skipIfKeyInVxIsSet(core: Chip8Core, x: number): void {
    if(core._input.getKey(core._registers.getVRegister(x)) === 1) {
        core.incrementProgramCounter();
    }
}

export function skipIfKeyInVxIsNotSet(core: Chip8Core, x: number): void {
    if(core._input.getKey(core._registers.getVRegister(x)) !== 1) {
        core.incrementProgramCounter();
    }
}