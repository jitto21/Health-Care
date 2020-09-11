import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })

export class RecordService {

  private records = [
    {regno: 847860, name: 'Harry James Potter', gender: 'Male', dob: '02/01/1987', address: '4 Privet Drive, Surrey, 680012', mobile: 9876543201, dept: 'Urology', doctor: 'Dr. Benjamin Richards'},
    {regno: 756329, name: 'Lilly James Potter', gender: 'Female', dob: '02/01/1960', address: '4 Privet Drive, Surrey, 680012', mobile: 9234567801, dept: 'Cardiology', doctor: 'Dr. Lewis Frank'},
  ]

  private recSubject = new Subject<any>();
  private personal: any = { };
  private contact : any= { };

  constructor(private router: Router, private _snackBar: MatSnackBar) {}

  fetchRecords() {
    return this.records.slice();
  }

  saveRecord(doctor) {

    let record = {
      ...doctor, name: `${this.personal.fname} ${this.personal.mname} ${this.personal.lname}`,
      address: `${this.contact.address1}, ${this.contact.address2}, ${this.contact.address3}, ${this.contact.pincode},`,
      mobile: +this.contact.mobile, gender: this.personal.gender, dob: this.personal.dob, regno: this.personal.regno
    };

    this.records.push(record);
    this.saveToSession(this.records, 'records');
    this.deleteFromSession('personal');
    this.deleteFromSession('contact');
  }

  editRecord(record) {
    this.records.map(rec => {
      if(rec.regno == record.regno) {
        console.log("found ", rec.regno);
        Object.assign(rec, record);
        return;
      }
    });
    this.recSubject.next(this.records);
    this.saveToSession(this.records, 'records');
  }

  editRecListener() {
    return this.recSubject.asObservable();
  }

  onSavePersonal(pers) {
    let regno: number = Math.floor(Math.random() * Math.floor(1000000));
    pers['regno'] = regno;
    this.personal = pers;
    this.saveToSession(pers, 'personal');
    this.router.navigate(['add/contact']);
  }

  onSaveContact(cont) {
    this.contact = cont;
    this.saveToSession(cont, 'contact');
    this.router.navigate(['add/doctor']);
  }

  onFetchPersonal() {
    return this.personal;
  }

  onFetchContact() {
    return this.contact;
  }

  //SESSION Storage

  saveToSession(obj, name) {
    sessionStorage.setItem(name, JSON.stringify(obj));
  }

  fetchFromSession(name) {
    return JSON.parse(sessionStorage.getItem(name));
  }

  deleteFromSession(name) {
    sessionStorage.removeItem(name);
  }

  refreshFromSession() {
    this.personal = JSON.parse(sessionStorage.getItem('personal'));
    this.contact = JSON.parse(sessionStorage.getItem('contact'));
    if(sessionStorage.getItem('records'))
      this.records = JSON.parse(sessionStorage.getItem('records'))
  }
}
