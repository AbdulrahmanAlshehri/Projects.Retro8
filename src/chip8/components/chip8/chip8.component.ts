import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chip8Service } from 'src/chip8/services/chip8.service';
import { OpCode } from 'src/chip8/core/opCode';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'chip8Page',
  templateUrl: './chip8.component.html',
  styleUrls: ['./chip8.component.css']
})
export class Chip8Component implements OnInit, AfterViewInit {
  
  @ViewChild('display')
  display: ElementRef<HTMLCanvasElement>;

  @ViewChild(MatTable)
  table: MatTable<OpCode[]>;


  public context: CanvasRenderingContext2D;

  public gameName: string = "Insert Game";

  public roms: string[] = [
    '15PUZZLE.ch8',
    'BLINKY.ch8',
    'BLITZ.ch8',
    'BRIX.ch8',
    'CONNECT4.ch8',
    'Fishie.ch8',
    'GUESS.ch8',
    'HIDDEN.ch8',
    'INVADERS.ch8',
    'KALEID.ch8',
    'MAZE.ch8',
    'MERLIN.ch8',
    'MISSILE.ch8',
    'PONG.ch8',
    'PONG2.ch8',
    'PUZZLE.ch8',
    'SYZYGY.ch8',
    'TANK.ch8',
    'TETRIS.ch8',
    'TICTAC.ch8',
    'UFO.ch8',
    'VBRIX.ch8',
    'VERS.ch8',
    'WIPEOFF.ch8'
  ]

  public selectedRom: string;

  public gameAssembly: OpCode[];

  private _currentFrame: number[][];

  private _currentRom: Uint8Array;

  private isRunning: boolean = false;

  constructor(
    private chip8Service: Chip8Service
  ) { 
    this.getNextFrame = this.getNextFrame.bind(this);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.context = this.display.nativeElement.getContext('2d');
    this.context.scale(8, 8);

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

    this._currentFrame = this.chip8Service.getNextFrame(this.chip8Service._chip8Core);

    this.drawFrame(this._currentFrame);
  }

  onStopClick(){
    this.isRunning = false;
  }

  onResetClick() {
    this.chip8Service.resetCore();
    this.selectedRom= null
  }

  getNextFrame() {
    this._currentFrame = this.chip8Service.getNextFrame(this.chip8Service._chip8Core);
    this.drawFrame(this._currentFrame);
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
  drawFrame(frame: number[][]) {
    this.context.clearRect(0, 0, this.display.nativeElement.width, this.display.nativeElement.height);
    const frameWidth = frame.length;
    const frameHeight = frame[0].length;
    for(let i = 0; i < frameWidth; i++) {
      for(let j = 0; j < frameHeight; j++) {
        if(frame[i][j] == 0) {
          this.context.fillStyle = 'black';
          this.context.fillRect(i, j, 1,1);
        }
        else if(frame[i][j] == 1) {
          this.context.fillStyle = 'white';
          this.context.fillRect(i, j, 1,1);
        }
        else {
          console.log('corrupt frame')
        }

      }
    }
  }
}
