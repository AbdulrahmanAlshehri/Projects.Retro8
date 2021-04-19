import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chip8Component } from './components/chip8/chip8.component';
import { GameControllerComponent } from './components/game-controller/game-controller.component';
import { DebuggerComponent } from './components/debugger/debugger.component';

import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    Chip8Component,
    DebuggerComponent,
    GameControllerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule
  ],
  exports: [
    Chip8Component
  ],
  providers: []
})
export class Chip8Module { }