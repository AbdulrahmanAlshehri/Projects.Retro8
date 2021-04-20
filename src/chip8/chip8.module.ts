import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Chip8Component } from './components/chip8/chip8.component';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { GameControllerComponent } from './components/game-controller/game-controller.component';
import { SystemControllerComponent } from './components/system-controller/system-controller.component';
import { DisplayComponent } from './components/display/display.component';

@NgModule({
  declarations: [
    Chip8Component,
    DebuggerComponent,
    DisplayComponent,
    GameControllerComponent,
    SystemControllerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatToolbarModule
  ],
  exports: [
    Chip8Component
  ],
  providers: []
})
export class Chip8Module { }