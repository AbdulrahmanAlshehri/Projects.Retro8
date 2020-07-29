import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chip8PageComponent } from './components/chip8page/chip8Page.component';


@NgModule({
  declarations: [
    Chip8PageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Chip8PageComponent
  ],
  providers: []
})
export class Chip8Module { }