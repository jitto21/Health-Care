import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  addForm = new FormGroup({
    regno: new FormControl('',[Validators.required]),
    fname: new FormControl('',[Validators.required]),
    mname: new FormControl(''),
    lname: new FormControl('',[Validators.required]),
    address1: new FormControl('',[Validators.required]),
    address2: new FormControl('',[Validators.required]),
    address3: new FormControl('',[Validators.required]),
    pincode: new FormControl('',[Validators.required]),
    mobile: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required]),
    gender: new FormControl('',[Validators.required]),
    dept: new FormControl('',[Validators.required]),
    doctor: new FormControl('',[Validators.required]),

  })

  constructor() { }

  ngOnInit(): void {
  }

  onNext() {
    console.log("personal: ",this.addForm.value);
  }

}
