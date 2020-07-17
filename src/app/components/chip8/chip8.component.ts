import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chip8Service } from 'src/app/services/chip8/chip8.service';

@Component({
  selector: 'app-chip8',
  templateUrl: './chip8.component.html',
  styleUrls: ['./chip8.component.css']
})
export class Chip8Component implements OnInit, AfterViewInit {
  
  @ViewChild('display')
  display: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  private _animationLoop;

  private _currentFrame: number[][];

  constructor(
    private chip8Service: Chip8Service
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.context = this.display.nativeElement.getContext('2d');
    // this.context.fillStyle = 'black';
    // this.context.fillRect(0, 0, this.display.nativeElement.width, this.display.nativeElement.height);
  }

  handleRomLoad(files: FileList) {
    const fileReader: FileReader = new FileReader();
    
    fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
      const raw: ArrayBuffer = e.target.result as ArrayBuffer;

      this.chip8Service.insertRom(this.readRawRom(raw));
    };

    fileReader.readAsArrayBuffer(files.item(0));
    
  }

  readRawRom(arrayBuffer: ArrayBuffer) {
    let romArray = new Uint8Array(arrayBuffer);
    return romArray;
  };

  onStartClick(){
    this._animationLoop = setInterval(this.chip8Service.getNextFrame, 500);
  }

  onNextFrameClick() {
    this._currentFrame = this.chip8Service.getNextFrame();

    this.drawFrame(this._currentFrame);
  }

  onStopClick(){
    clearInterval(this._animationLoop);
  }

  drawFrame(frame: number[][]) {
    this.context.scale(16, 16)
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
