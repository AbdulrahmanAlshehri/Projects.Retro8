import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { Chip8PageComponent } from './chip8/components/chip8page/chip8Page.component';

const routes: Routes = [
  { path: '', redirectTo: '/chip8', pathMatch: 'full'},
  { path: 'chip8', component: Chip8PageComponent}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
