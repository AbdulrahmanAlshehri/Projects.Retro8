import { Injectable } from '@angular/core';
import { Chip8Core } from 'src/chip8/core/chip8Core';
import { OpCode } from 'src/chip8/core/opCode';

@Injectable({
  providedIn: 'root'
})
export class Chip8Service {

  public _chip8Core: Chip8Core;
  
  constructor() {
    this._chip8Core = new Chip8Core();
  }

  insertRom(rom: Uint8Array) {
    this._chip8Core.insertRom(rom);
  }


  resetCore() {
    this._chip8Core = new Chip8Core();
  }

  getNextFrame(core: Chip8Core, speed=1): number[][] {
    for(let i=0; i < speed; i++) {
      core.executeCycle();
    }
    return core.getFrame();
  }

  disassembleRom(rom: Uint8Array): OpCode[] {
    return this._chip8Core.disassembleRom(rom);
  }

  onKeyDown(keyNumber: number) {
    this._chip8Core.onKeyDown(keyNumber);
  }

  onKeyUp(keyNumber: number) {
    this._chip8Core.onKeyUp(keyNumber);
  }
}
