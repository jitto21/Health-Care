import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  adrsCount: number = 1;
  addForm: FormGroup;

  constructor(private recService: RecordService, private fb: FormBuilder) {
    this.addForm = this.fb.group({
      pincode: new FormControl('',[Validators.required]),
      pmobile: new FormControl('',[Validators.required]),
      hmobile: new FormControl(''),
      addresses: this.fb.array([], [Validators.required])
    })
   }

   addresses(): FormArray {
     return this.addForm.get('addresses') as FormArray;
   }

   newAddress(address: string): FormGroup {
     return this.fb.group({
      address: [address, [Validators.required]]
     })
   }

   addAddress(address: string) {
    this.addresses().push(this.newAddress(address));
   }

   removeAddress(i: number) {
    this.addresses().removeAt(i);
   }

  ngOnInit(): void {
    if(this.recService.fetchFromSession('contact')) {
      console.log("contact already in storage");
      console.log(this.recService.fetchFromSession('contact'));
      this.recService.fetchFromSession('contact').addresses.forEach(address => {
        console.log(address);
        this.addAddress(address);
      })
      this.addForm.setValue(this.recService.fetchFromSession('contact'));
    }
    else {
      this.addAddress('');
    }
  }

  onNext() {
    console.log("conatct: ",this.addForm.value);
    this.recService.onSaveContact(this.addForm.value);
  }
}
