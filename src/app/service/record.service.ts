import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })

export class RecordService {

  private records = [
    { regno: 847860, name: 'Harry James Potter', gender: 'Male', dob: '1987-02-25', addresses: [{ address: '4 Privet Drive' }, { address: 'Surrey' }], pincode: 654322, pmobile: 9876543201, hmobile: '', dept: 'Urology', doctor: 'Dr. Benjamin Richards' },
    { regno: 756329, name: 'Lilly James Potter', gender: 'Female', dob: '1960-01-15', addresses: [{ address: '4 Privet Drive' }, { address: 'Surrey' }], pincode: 614322, pmobile: 9234567801, hmobile: '', dept: 'Cardiology', doctor: 'Dr. Lewis Frank' },
    { dept: 'Oncology & Radiation Oncology', doctor: 'Dr. Lewis Frank', name: 'Morgan Torres', addresses: [ { address: 'Sunshine Villa' }, { address: 'Alasca' }, { address: 'Washington' } ], pincode: '988223', pmobile: 8745735801, hmobile: 4692645239, gender: 'Female', dob: '1985-04-02', regno: 320071 },
    { dept: 'Pathology', doctor: 'Dr. Lewis Frank', name: 'Alex Telles', addresses: [ { address: '43 Avenue' }, { address: 'North Kannur' }, { address: 'Kerala' } ], pincode: '456123', pmobile: 9988663355, hmobile: 4693248212, gender: 'Male', dob: '1990-12-08', regno: 865974 },
    { dept: 'Orthopaedics', doctor: 'Dr. Benjamin Richards', name: 'Ronald Thomas Weasely', addresses: [ { address: 'Tree House' }, { address: 'Marriot' }, { address: 'UK' } ], pincode: '935231', pmobile: 9977668651, hmobile: 8767343729, gender: 'Male', dob: '1989-07-04', regno: 509625 }
  ]

  private recSubject = new Subject<any>();
  private personal: any = {};
  private contact: any = {};

  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  fetchRecords() {
    return this.records.slice();
  }

  saveRecord(doctor) {

    let record = {
      ...doctor, name: `${this.personal.fname} ${this.personal.mname} ${this.personal.lname}`,
      addresses: this.contact.addresses, pincode: this.contact.pincode, pmobile: +this.contact.pmobile, hmobile: +this.contact.hmobile,
      gender: this.personal.gender, dob: this.personal.dob, regno: this.personal.regno
    };

    this.records.push(record);
    this.saveToSession(this.records, 'records');
    this.deleteFromSession('personal');
    this.deleteFromSession('contact');
    this.personal = {};
    this.contact = {};
    this._snackBar.open('New Record Added!', '', {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  editRecord(record) {
    this.records.map(rec => {
      if (rec.regno == record.regno) {
        console.log("found ", rec.regno);
        Object.assign(rec, record);
        return;
      }
    });
    this.recSubject.next({ records: this.records, op: 'edit' });
    this.saveToSession(this.records, 'records');
  }

  deleteRecord(regno) {
    this.records = this.records.filter(record => {
      return record.regno != regno;
    });
    this.recSubject.next({ records: this.records, op: 'delete' });
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
    if (sessionStorage.getItem('records'))
      this.records = JSON.parse(sessionStorage.getItem('records'))
  }
}
