import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NgHelpComponent } from './ng-help/ng-help.component';
import { Chip8Component } from './chip8/chip8.component';

const routes: Routes = [
  { path: '', redirectTo: '/chip8', pathMatch: 'full'},
  { path: 'help', component: NgHelpComponent},
  { path: 'chip8', component: Chip8Component}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
