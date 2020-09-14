import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  public depts = [ 'Cardiology', 'Dental', 'Dermatology', 'Diabetologist', 'Endocrinology', 'ENT', 'Gastroenterology', 'General Medicine', 'General Medicine',
  'Nephrology', 'Neurology', 'Obstetrics & Gynecology', 'Oncology & Radiation Oncology', 'Ophthalmology', 'Orthopaedics', 'Pathology', 'Radiology', 'Urology'];

  public doctors = ['Dr. Benjamin Richards', 'Dr. Lewis Frank'];
  personal = {}
  contact = {}
  emptyP: boolean = false;
  emptyC: boolean = false;

  addForm = new FormGroup({
    dept: new FormControl('', [Validators.required]),
    doctor: new FormControl('', [Validators.required])
  })

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
    this.personal = this.recService.onFetchPersonal();
    this.contact = this.recService.onFetchContact();
    console.log(this.personal, this.contact);
    if(this.personal==null || Object.keys(this.personal).length == 0) {
      console.log("personal details empty")
      this.emptyP = true;
    }
    if(this.contact==null || Object.keys(this.contact).length == 0) {
      console.log("contact details empty")
      this.emptyC = true;
    }
  }

  onSubmit() {
    console.log("doctor: ", this.addForm.value);
    this.recService.saveRecord(this.addForm.value)
  }
}
