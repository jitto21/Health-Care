import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  public depts = ['Gastroenterology', 'Cardiology', 'Dental', 'Dermatology', 'Endocrinology', 'ENT', 'Diabetologist', 'General Medicine', 'General Medicine',
  'Nephrology', 'Neurology', 'Obstetrics & Gynecology', 'Oncology & Radiation Oncology', 'Ophthalmology', 'Orthopaedics', 'Pathology', 'Radiology', 'Urology'];

  public doctor = []
  personal = {}
  contact = {}
  emptyP: boolean = false;
  emptyC: boolean = false;

  addForm = new FormGroup({
    dept: new FormControl('',[Validators.required]),
    doctor: new FormControl('',[Validators.required])
  })

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
    this.personal = this.recService.onFetchPersonal;
    this.contact = this.recService.onFetchContact;
    if(Object.keys(this.personal).length == 0 && this.personal) {
      this.emptyP = true;
    }
    if(Object.keys(this.contact).length == 0 && this.contact) {
      this.emptyC = true;
    }
  }

  onNext() {

  }
}
