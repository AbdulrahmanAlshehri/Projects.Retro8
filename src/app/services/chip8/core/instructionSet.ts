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

export function setVxTo(core: Chip8Core, x: number, NN: number): void {
    core._registers.setVRegister(x, NN);
}

export function incrementVxBy(core: Chip8Core, x: number, NN: number): void {
    let value = core._registers.getVRegister(x) + NN;
    core._registers.setVRegister(x, value);
}

