import { NgModule } from "@angular/core";
import { PersonalComponent } from './personal/personal.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorComponent } from './doctor/doctor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AddRoutingModule } from './add-routing.module';
import { MatFormField } from '@angular/material/form-field';

@NgModule({
  declarations: [PersonalComponent, ContactComponent, DoctorComponent],
  imports: [AddRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule]
})

export class AddModule {}
