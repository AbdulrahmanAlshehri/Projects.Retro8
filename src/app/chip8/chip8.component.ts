import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chip8Instruction } from 'src/models/chip8Instruction';

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
        const raw: string = e.target.result as string;
        let inustrction: Chip8Instruction = new Chip8Instruction(raw.slice(0, 2));
        // this.loadedRom  = this.readRawRom(raw)
        console.log(inustrction);
    };
    files.item(0).text().then(r => console.log(r));
    fileReader.readAsBinaryString(files.item(0))
  }

  readRawRom(arrayBuffer: ArrayBuffer) {
    const dataView: DataView = new DataView(arrayBuffer);
    let bigEndianArray = new Uint16Array(80);
    for(let i = 0; i < 80; i++)
    bigEndianArray[i] =  dataView.getUint16(i, false)
    return bigEndianArray;
  };

}
