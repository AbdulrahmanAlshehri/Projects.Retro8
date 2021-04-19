import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'chip8-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  @ViewChild('canvas')
  public canvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.scale(8, 8);
  }

  drawFrame(frame: number[][]) {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
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
