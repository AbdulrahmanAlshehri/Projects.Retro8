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

  constructor(
    private chip8Service: Chip8Service
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.context = this.display.nativeElement.getContext('2d');
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.display.nativeElement.width, this.display.nativeElement.height);
  }

  handleRomLoad(files: FileList) {
    const fileReader: FileReader = new FileReader();
    
    fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
      const raw: ArrayBuffer = e.target.result as ArrayBuffer;
      // let stringRom: string[] = [];
      
      // for(let i = 0; i < this.loadedRom.length; i++) {
      //   stringRom[i] = this.loadedRom[i].toString(16);
      // }
      
      this.chip8Service.insertRom(this.readRawRom(raw));
    };

    fileReader.readAsArrayBuffer(files.item(0));
    
  }

  readRawRom(arrayBuffer: ArrayBuffer) {
    let romArray = new Uint8Array(arrayBuffer);
    return romArray;
  };

}
