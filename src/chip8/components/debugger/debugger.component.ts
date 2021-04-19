import { Component, Input, OnInit } from '@angular/core';
import { OpCode } from 'src/chip8/core/opCode';

@Component({
  selector: 'chip8-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})
export class DebuggerComponent implements OnInit {

  @Input()
  public gameAssembly: OpCode[];

  public gameAssemblyColumns: string[] = ['lineNumber','OpCode', 'Assembly', 'Description'];

  constructor() { }

  ngOnInit(): void {
  }

}
