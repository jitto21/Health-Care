import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

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

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
  }

  onNext() {
    console.log("conatct: ",this.addForm.value);
    this.recService.onSaveContact(this.addForm.value);
  }
}
