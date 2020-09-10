import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  addForm = new FormGroup({
    regno: new FormControl(''),
    fname: new FormControl('',[Validators.required]),
    mname: new FormControl(''),
    lname: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required]),
    gender: new FormControl('',[Validators.required])
  })

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
  }

  onNext() {
    console.log("personal: ",this.addForm.value);
    this.recService.onSavePersonal(this.addForm.value);
  }

}
