import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  maxDate;
  addForm: FormGroup

  constructor(private recService: RecordService, private datePipe: DatePipe) {
    this.maxDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      regno: new FormControl(''),
      fname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      mname: new FormControl('', [Validators.pattern('^[A-Za-z]*$')]),
      lname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      dob: new FormControl('', [Validators.required, this.validateDob.bind(this)]),
      gender: new FormControl('', [Validators.required])
    })
    if (this.recService.fetchFromSession('personal')) {
      console.log("personal already in storage");
      this.addForm.setValue(this.recService.fetchFromSession('personal'));
    }
  }

  onNext() {
    console.log("personal: ", this.addForm.value);
    this.recService.onSavePersonal(this.addForm.value);
  }

  getErrorMessage(control: string) {
    if (this.addForm.get(control).hasError('required')) {
      return 'You must enter a value';
    }
    if (this.addForm.get(control).hasError('pattern')) {
      return 'You must enter a valid name';
    }
    if (this.addForm.get(control).hasError('dobInvalid')) {
      return 'You must enter a valid D.O.B';
    }
  }

  validateDob(control: AbstractControl): { [key: string]: any } | null {
    if (control.value > this.maxDate) {
      return { 'dobInvalid': true };
    }
    return null;
  }

}
