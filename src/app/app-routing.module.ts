import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';


const routes: Routes = [
  { path: 'add', loadChildren: ()=> import('./add/add.module').then(m => m.AddModule) },
  { path: 'show', component: ShowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
