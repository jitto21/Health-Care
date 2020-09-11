import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class RecordService {

  private records = [
    {name: 'Harry James Potter', gender: 'Male', dob: '02/01/1987', address: '4 Privet Drive, Surrey, 680012', mobile: 9876543201, dept: 'Onchology', doctor: 'Dr. Benjamin Richards'},
    {name: 'Lilly James Potter', gender: 'Female', dob: '02/01/1960', address: '4 Privet Drive, Surrey, 680012', mobile: 9234567801, dept: 'Cardiology', doctor: 'Dr. Lewis Frank'},
  ]

  private personal: any = { };
  private contact : any= { };

  constructor(private router: Router) {}

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
