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
    pmobile: new FormControl('',[Validators.required]),
    hmobile: new FormControl('')
  })

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
    if(this.recService.fetchFromSession('contact')) {
      console.log("contact already in storage");
      this.addForm.setValue(this.recService.fetchFromSession('contact'));
    }
  }

  onNext() {
    console.log("conatct: ",this.addForm.value);
    this.recService.onSaveContact(this.addForm.value);
  }
}
