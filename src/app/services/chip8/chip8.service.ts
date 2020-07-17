import { Injectable } from '@angular/core';
import { Chip8Core } from './chip8Core';

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

  getNextFrame(): number[][] {
    this._chip8Core.execute_cycle();
    return this._chip8Core.getFrame();
  }
}
