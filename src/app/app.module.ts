import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { NgHelpComponent } from './components/ng-help/ng-help.component';
import { AppRoutingModule } from './components/app/app-routing.module';
import { Chip8Component } from './components/chip8/chip8.component';

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
