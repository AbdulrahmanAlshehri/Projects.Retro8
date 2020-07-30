import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chip8Service } from 'src/app/chip8/services/chip8.service';

@Component({
  selector: 'chip8Page',
  templateUrl: './chip8Page.component.html',
  styleUrls: ['./chip8Page.component.css']
})
export class Chip8PageComponent implements OnInit, AfterViewInit {
  
  @ViewChild('display')
  display: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  public gameName: string = "Insert Game";

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

  handleRomLoad(files: FileList) {
    const fileReader: FileReader = new FileReader();
    
    fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
      const raw: ArrayBuffer = e.target.result as ArrayBuffer;

      this._currentRom = this.readRawRom(raw);
    };

    fileReader.readAsArrayBuffer(files.item(0));
    this.gameName = files.item(0).name;
    
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
    this.gameName = "Insert Game";
  }

  getNextFrame() {
    this._currentFrame = this.chip8Service.getNextFrame(this.chip8Service._chip8Core);
    this.drawFrame(this._currentFrame);
    if(this.isRunning) {
      requestAnimationFrame(this.getNextFrame);
    }
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
