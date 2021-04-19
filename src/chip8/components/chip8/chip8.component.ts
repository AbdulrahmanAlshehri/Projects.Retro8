import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chip8Service } from 'src/chip8/services/chip8.service';
import { OpCode } from 'src/chip8/core/opCode';
import { DisplayComponent } from '../display/display.component';

@Component({
  selector: 'chip8Page',
  templateUrl: './chip8.component.html',
  styleUrls: ['./chip8.component.css']
})
export class Chip8Component implements OnInit {
  
  @ViewChild('display')
  display: DisplayComponent;

  public gameAssembly: OpCode[];

  private _currentRom: Uint8Array;

  private isRunning: boolean = false;

  constructor(
    private chip8Service: Chip8Service
  ) { 
    this.getNextFrame = this.getNextFrame.bind(this);
  }

  ngOnInit(): void {
  }

  readRawRom(arrayBuffer: ArrayBuffer) {
    let romArray = new Uint8Array(arrayBuffer);
    return romArray;
  };

  onStartClick(){
    this.isRunning = true;
    this.chip8Service.insertRom(this._currentRom);
    window.requestAnimationFrame(this.getNextFrame);
  }

  onNextFrameClick() {
    if(!this.chip8Service._chip8Core.isRomLoaded) {
      this.chip8Service.insertRom(this._currentRom);
    }

    this.display.drawFrame(this.chip8Service.getNextFrame(this.chip8Service._chip8Core));
  }

  onStopClick(){
    this.isRunning = false;
  }

  onResetClick() {
    this.chip8Service.resetCore();
  }

  getNextFrame() {
    this.display.drawFrame(this.chip8Service.getNextFrame(this.chip8Service._chip8Core));
    if(this.isRunning) {
      requestAnimationFrame(this.getNextFrame);
    }
  }
  async onRomChange(event) {
    this.chip8Service.resetCore();
    let romName = event;
    console.log(event);
    const rom = await fetch(`assets/roms/chip8/${romName}`).then(res => {
      return res.arrayBuffer()
    });
    this._currentRom = this.readRawRom(rom);
    this.gameAssembly = this.chip8Service.disassembleRom(this._currentRom);
  }
}
