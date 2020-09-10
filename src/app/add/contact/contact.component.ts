import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  addForm = new FormGroup({
    address1: new FormControl('',[Validators.required]),
    address2: new FormControl('',[Validators.required]),
    address3: new FormControl('',[Validators.required]),
    pincode: new FormControl('',[Validators.required]),
    mobile: new FormControl('',[Validators.required])
  })

  constructor() { }

  ngOnInit(): void {
  }

  onNext() {
    
  }
}
