import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgHelpComponent } from './ng-help/ng-help.component';
import { AppRoutingModule } from './app-routing.module';
import { Chip8Component } from './chip8/chip8.component';

@NgModule({
  declarations: [
    AppComponent,
    NgHelpComponent,
    Chip8Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
