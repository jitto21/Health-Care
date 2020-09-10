import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AddComponent } from './add.component';

const addRoutes: Routes = [
  { path: '', component: AddComponent, children: [
    { path: 'personal', component: PersonalComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'doctor', component: DoctorComponent }
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(addRoutes)],
  exports: [RouterModule]
})
export class AddRoutingModule {}
