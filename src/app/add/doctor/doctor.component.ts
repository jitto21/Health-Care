import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from 'src/app/service/record.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  public depts = [];
  public doctors = [];
  personal = {}
  contact = {}
  emptyP: boolean = false;
  emptyC: boolean = false;
  loginMode: boolean = false;

  addForm = new FormGroup({
    dept: new FormControl('', [Validators.required]),
    doctor: new FormControl('', [Validators.required])
  })

  constructor(private recService: RecordService, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe( params => {
      this.loginMode = params['loginMode'] ? params['loginMode'] : false;
      console.log("loginMode: ", this.loginMode);
    })
    this.depts = this.recService.fetchDocsandDepts().depts;
    this.doctors = this.recService.fetchDocsandDepts().doctors;
    this.personal = this.recService.onFetchPersonal();
    this.contact = this.recService.onFetchContact();
    console.log(this.personal, this.contact);
    if((this.personal==null || Object.keys(this.personal).length == 0)) {
      console.log("personal details empty")
      this.emptyP = true;
    }
    if((this.contact==null || Object.keys(this.contact).length == 0)) {
      console.log("contact details empty")
      this.emptyC = true;
    }
  }

  onCheckDisable(): boolean {
    if(this.loginMode && this.addForm.valid) {
      return false; //enable if in Login Mode
    }
    if((this.emptyC || this.emptyP)) {
      return true; //disable if contact or personal info is empty
    }
    if(this.addForm.valid) {
      console.log("form VALID")
      return false;
    }
    return true;
  }

  onDisplayAlert() {
    if(this.loginMode) {
      return false; //enable if in Login Mode
    }
    if((this.emptyC || this.emptyP)) {
      return true; //disable if contact or personal info is empty
    }
    return false;
  }

  onSubmit() {
    console.log("doctor: ", this.addForm.value);
    this.recService.saveRecord(this.addForm.value);
    this.addForm.reset();
  }
}
