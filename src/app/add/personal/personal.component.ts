import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  maxDate;
  addForm = new FormGroup({
    regno: new FormControl(''),
    fname: new FormControl('',[Validators.required]),
    mname: new FormControl(''),
    lname: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required]),
    gender: new FormControl('',[Validators.required])
  })

  constructor(private recService: RecordService, private datePipe: DatePipe) {
    this.maxDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  }

  ngOnInit(): void {
    if(this.recService.fetchFromSession('personal')) {
      console.log("personal already in storage");
      this.addForm.setValue(this.recService.fetchFromSession('personal'));
    }
  }

  onNext() {
    console.log("personal: ",this.addForm.value);
    this.recService.onSavePersonal(this.addForm.value);
  }

}
