import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  addForm = new FormGroup({
    dept: new FormControl('',[Validators.required]),
    doctor: new FormControl('',[Validators.required])
  })

  constructor() { }

  ngOnInit(): void {
  }

  onNext() {

  }
}
