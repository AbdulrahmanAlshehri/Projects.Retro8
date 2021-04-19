import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'chip8-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.css']
})
export class GameControllerComponent implements OnInit {

  @Output()
  gameControllerKeyDownEvent = new EventEmitter<number>();

  @Output()
  gameControllerKeyUpEvent = new EventEmitter<number>();
  

  constructor() { }

  ngOnInit(): void {
  }

  onButtonMouseDown(button: string) {
    this.gameControllerKeyDownEvent.emit(parseInt(button, 16));
  }

  onButtonMouseUp(button: string) {
    this.gameControllerKeyUpEvent.emit(parseInt(button, 16));
  }
}
