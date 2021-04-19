import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'chip8-system-controller',
  templateUrl: './system-controller.component.html',
  styleUrls: ['./system-controller.component.css']
})
export class SystemControllerComponent implements OnInit {

  
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

  @Output()
  startEvent = new EventEmitter();

  @Output()
  pauseEvent = new EventEmitter();

  @Output()
  resetEvent = new EventEmitter();

  @Output()
  nextEvent = new EventEmitter();

  @Output()
  romChangeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onRomChange(selectedRom) {
    this.romChangeEvent.emit(selectedRom);
  }

  onStartClick() {
    this.startEvent.emit(null);
  }

  onResetClick() {
    this.resetEvent.emit(null);
  }

}
