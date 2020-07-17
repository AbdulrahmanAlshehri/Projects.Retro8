import { Injectable } from '@angular/core';
import { Memory } from './memory';
import { Registers } from './registers';
import { Stack } from './stack';
import { Chip8Core } from './chip8Core';

@Injectable({
  providedIn: 'root'
})
export class Chip8Service {

  private _chip8Core: Chip8Core;
  
  constructor() {
    this._chip8Core = new Chip8Core();
  }

  insertRom(rom: Uint8Array) {
    this._chip8Core.insertRom(rom);
  }
}
