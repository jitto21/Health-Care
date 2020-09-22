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
      pincode: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern('^[1-9]{1}[0-9]{5}$')]),
      pmobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[1-9]{1}[0-9]{9}$')]),
      hmobile: new FormControl('', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[1-9]{1}[0-9]{9}$')]),
      addresses: this.fb.array([])
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
    if (this.recService.fetchFromSession('contact')) {
      console.log("contact already in storage");
      console.log(this.recService.fetchFromSession('contact'));
      this.recService.fetchFromSession('contact').addresses.forEach(address => {
        console.log(address);
        this.addAddress(address);
      })
      this.addForm.setValue(this.recService.fetchFromSession('contact'));
    }
    else {
      [0, 1, 2].forEach(() => { this.addAddress(''); })
    }
  }

  onNext() {
    console.log("conatct: ", this.addForm.value);
    this.recService.onSaveContact(this.addForm.value);
  }

  getErrorMessage(control: string, index?: number) {
    let con = <FormArray> this.addForm.controls['addresses'];
    // let group = <FormGroup> con.controls[index];
    // if(con.controls[index]) {
    //   return 'You must enter a value';
    // }
    if (this.addForm.get(control).hasError('required') || con.controls[index]) {
      return 'You must enter a value';
    }

    if (this.addForm.get(control).hasError('minlength') || this.addForm.get(control).hasError('maxlength')) {
      switch (control) {
        case 'pincode': return 'You must enter a 6 digit number';
        case 'pmobile': return 'You must enter a 10 digit number';
        case 'hmobile': return 'You must enter a 10 digit number';
      }
    }

    if (this.addForm.get(control).hasError('pattern')) {
      switch (control) {
        case 'address': return 'You must enter a valid address';
        case 'pincode': return 'You must enter a valid pincode';
        case 'pmobile': return 'You must enter a valid mobile number';
        case 'hmobile': return 'You must enter a valid mobile number';
      }
    }
  }
}
