import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chip8',
  templateUrl: './chip8.component.html',
  styleUrls: ['./chip8.component.css']
})
export class Chip8Component implements OnInit, AfterViewInit {
  
  @ViewChild('display')
  display: ElementRef<HTMLCanvasElement>;

  loadedRom: Uint16Array = null;

  public context: CanvasRenderingContext2D;

  constructor() { }

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
        console.log(raw);
        this.loadedRom  = this.readRawRom(raw);
        let stringRom = [];

        for(let i = 0; i < this.loadedRom.length; i++) {
          stringRom[i] = this.loadedRom[i].toString(16);
        }

        console.log(stringRom);
    };

    fileReader.readAsArrayBuffer(files.item(0))
  }

  readRawRom(arrayBuffer: ArrayBuffer) {
    const dataView: DataView = new DataView(arrayBuffer);
    let bigEndianArray = new Uint16Array(80);
    for(let i = 0; i < 160; i=i+2)
    bigEndianArray[Math.ceil(i/2)] =  dataView.getUint16(i, false)
    return bigEndianArray;
  };

}
