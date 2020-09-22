import { NgModule } from "@angular/core";
import { PersonalComponent } from './personal/personal.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorComponent } from './doctor/doctor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AddRoutingModule } from './add-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [PersonalComponent, ContactComponent, DoctorComponent],
  imports: [AddRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule, CommonModule, MatSortModule, BrowserAnimationsModule],
  providers: [DatePipe]
})

export class AddModule {}
