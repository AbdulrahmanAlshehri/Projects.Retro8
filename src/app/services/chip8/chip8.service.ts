import { Injectable } from '@angular/core';
import { Chip8Core } from './core/chip8Core';

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

  getNextFrame(core: Chip8Core): number[][] {
    core.executeCycle();
    return core.getFrame();
  }
}
