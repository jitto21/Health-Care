import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })

export class RecordService {

  private records = [
    { regno: 847860, name: 'Harry James Potter', gender: 'Male', dob: '1987-02-25', addresses: [{ address: '4 Privet Drive' }, { address: 'Surrey' }], pincode: 654322, pmobile: 9876543201, hmobile: '', dept: 'Urology', doctor: 'Dr. Benjamin Richards' },
    { regno: 756329, name: 'Lilly James Potter', gender: 'Female', dob: '1960-01-15', addresses: [{ address: '4 Privet Drive' }, { address: 'Surrey' }], pincode: 614322, pmobile: 9234567801, hmobile: '', dept: 'Cardiology', doctor: 'Dr. Lewis Frank' },
    { dept: 'Oncology & Radiation Oncology', doctor: 'Dr. Lewis Frank', name: 'Morgan Torres', addresses: [{ address: 'Sunshine Villa' }, { address: 'Alasca' }, { address: 'Washington' }], pincode: 988223, pmobile: 8745735801, hmobile: 4692645239, gender: 'Female', dob: '1985-04-02', regno: 320071 },
    { dept: 'Pathology', doctor: 'Dr. Lewis Frank', name: 'Alex Telles', addresses: [{ address: '43 Avenue' }, { address: 'North Kannur' }, { address: 'Kerala' }], pincode: 456123, pmobile: 9988663355, hmobile: 4693248212, gender: 'Male', dob: '1990-12-08', regno: 865974 },
    { dept: 'Orthopaedics', doctor: 'Dr. Benjamin Richards', name: 'Ronald Thomas Weasely', addresses: [{ address: 'Tree House' }, { address: 'Marriot' }, { address: 'UK' }], pincode: 935231, pmobile: 9977668651, hmobile: 8767343729, gender: 'Male', dob: '1989-07-04', regno: 509625 }
  ]

  private loginFound: boolean = false;
  private existing: boolean = false;
  private loginRecord: any = {};
  private recSubject = new Subject<any>();
  private personal: any = {};
  private contact: any = {};
  private depts = ['Gastroenterology', 'Cardiology', 'Dental', 'Dermatology', 'Endocrinology', 'ENT', 'Diabetologist', 'General Medicine', 'General Medicine',
    'Nephrology', 'Neurology', 'Obstetrics & Gynecology', 'Oncology & Radiation Oncology', 'Ophthalmology', 'Orthopaedics', 'Pathology', 'Radiology', 'Urology'];
  private doctors = ['Dr. Benjamin Richards', 'Dr. Lewis Frank'];

  constructor(private router: Router, private _snackBar: MatSnackBar) { }

  /*  ADDING A RECORD - START */

  saveRecord(doctor) {


    let record = (this.loginRecord == null || Object.keys(this.loginRecord).length == 0) ?
      {
        ...doctor, name: `${this.personal.fname} ${this.personal.mname} ${this.personal.lname}`,
        addresses: this.contact.addresses, pincode: +this.contact.pincode, pmobile: +this.contact.pmobile, hmobile: this.contact.hmobile,
        gender: this.personal.gender, dob: this.personal.dob, regno: +this.personal.regno
      } :
      {
        ...this.loginRecord, ...doctor
      }

    console.log("Record: ", record);

    this.records.map( rec => {
      if(this.isEquivalent(rec,record)) {
        console.log("existing record");
        this.existing = true;
        this._snackBar.open("Existing Record Found ! Try changing department or doctor.", '', {
          duration: 5000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
        return;
      }
    })

    if(this.existing) { this.existing = false; return; }

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

  onLogin(regno) {
    this.records.map(rec => {
      if (rec.regno == +regno) { //user found
        this.loginRecord = rec;
        this.saveToSession(this.loginRecord, 'loginRecord');
        this.loginFound = true;
        console.log("found: ", rec);
        this._snackBar.open(`Welcome ${rec.name}`, '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.router.navigate(['add/doctor'], { queryParams: { loginMode: true } }); //to add new dept and doctor
        return;
      }
    });
    if (!this.loginFound) { //user NOT found
      this.loginFound = false;
      this._snackBar.open(`User Not Found !`, '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      console.log("%c NOT found", 'color: red');
    }
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
    console.log("Contact ",this.contact)
    this.saveToSession(cont, 'contact');
    this.router.navigate(['add/doctor']);
  }

  onFetchPersonal() {
    return this.personal;
  }

  onFetchContact() {
    return this.contact;
  }

  /*  ADDING A RECORD - END */

  /*  SHOWING A RECORD - START */


  fetchRecords() {
    return this.records.slice();
  }

  editRecord(record, orgRecord) {
    // console.log("org Record: ", orgRecord);
    // console.log("to save Record: ", record);
    // let orgRec = { ...orgRecord };
    // delete orgRec.joinedAdrs;
    // let rec = {...record}
    // rec = this.sortKeys(rec); orgRec = this.sortKeys(orgRec);
    // console.log("org Record after del: ", orgRec);
    // console.log("Equal=> ", this.isEquivalent(rec, orgRec));

    // if (this.isEquivalent(rec, recd)) {
    //   console.log("%c No CHNAGES", 'color: yellow');
    //   return this._snackBar.open('No Changes Made', '', {
    //     duration: 3000,
    //     panelClass: ['mat-toolbar', 'mat-accent']
    //   });
    // }

    console.log("%c NO CHANGES CHECK ENDED", 'color: pink')
    this.records.map(rec => {
      console.log("Equal=> ", this.isEquivalent(rec, orgRecord));
      if (rec.regno == record.regno && this.isEquivalent(rec, orgRecord)) {
        console.log(`%cSucessfully updated; array Record `, 'color: green');
        console.log(record);
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

  fetchDocsandDepts() {
    return {
      depts: this.depts,
      doctors: this.doctors
    }
  }

  /*  SHOWING A RECORD - END */

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
    this.loginRecord = JSON.parse(sessionStorage.getItem('loginRecord'));
    if (sessionStorage.getItem('records'))
      this.records = JSON.parse(sessionStorage.getItem('records'))
  }

  //Object Value Check

  isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      console.log("diff length")
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        console.log("diff value in ", propName, propName);
        console.log("diff value in ", aProps, bProps);
        console.log("diff value in ", a[propName], b[propName]);
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    console.log("same value ", a, b)
    return true;
  }

  //sort an Object on its ppty

  sortKeys(obj_1) {
    var key = Object.keys(obj_1)
      .sort(function order(key1, key2) {
        if (key1 < key2) return -1;
        else if (key1 > key2) return +1;
        else return 0;
      });

    // Taking the object in 'temp' object
    // and deleting the original object.
    var temp = {};

    for (var i = 0; i < key.length; i++) {
      temp[key[i]] = obj_1[key[i]];
      delete obj_1[key[i]];
    }

    // Copying the object from 'temp' to
    // 'original object'.
    for (var i = 0; i < key.length; i++) {
      obj_1[key[i]] = temp[key[i]];
    }
    return obj_1;
  }

  //Filters

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      console.log("createFilter");
      console.log("************");
      console.log(data);
      console.log(searchTerms);
      console.log(`%c ${data.name}`, 'color: yellow')
      console.log(`${data['name']}: `, data['name'].toLowerCase().indexOf(searchTerms['name']) !== -1)
      console.log(`${data['regno']}: `, data['regno'].toString().toLowerCase().indexOf(searchTerms['reg no:']) !== -1)
      console.log(`${data['gender']}: `, data['gender'].toLowerCase().indexOf(searchTerms['gender']) !== -1)
      console.log(`${data['dob']}: `, data['dob'].toLowerCase().indexOf(searchTerms['d.o.b']) !== -1)
      console.log(`${data['joinedAdrs']}: `, data['joinedAdrs'].toLowerCase().indexOf(searchTerms['address']) !== -1)
      console.log(`${data['pincode']}: `, data['pincode'].toString().toLowerCase().indexOf(searchTerms['pincode']) !== -1)
      console.log(`${data['pmobile']}: `, data['pmobile'].toString().toLowerCase().indexOf(searchTerms['personal number']) !== -1)
      console.log(`${data['hmobile']}: `, data['hmobile'].toString().toLowerCase().indexOf(searchTerms['home/office number']) !== -1)
      console.log(`${data['doctor']}: `, data['doctor'].toLowerCase().indexOf(searchTerms['doctor']) !== -1);

      return data['name'].toLowerCase().indexOf(searchTerms['name']) !== -1
        && data['regno'].toString().toLowerCase().indexOf(searchTerms['reg no:']) !== -1
        && data['gender'].toLowerCase().indexOf(searchTerms['gender']) !== -1
        && data['dob'].toLowerCase().indexOf(searchTerms['d.o.b']) !== -1
        && data['joinedAdrs'].toLowerCase().indexOf(searchTerms['address']) !== -1
        && data['pincode'].toString().toLowerCase().indexOf(searchTerms['pincode']) !== -1
        && data['pmobile'].toString().toLowerCase().indexOf(searchTerms['personal number']) !== -1
        && data['hmobile'].toString().toLowerCase().indexOf(searchTerms['home/office number']) !== -1
        && data['dept'].toLowerCase().indexOf(searchTerms['department']) !== -1
        && data['doctor'].toLowerCase().indexOf(searchTerms['doctor']) !== -1
    }
    return filterFunction;
  }

  createFilterAll(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      console.log("createFilterAll");
      console.log("***************")
      console.log(data);
      console.log(searchTerms);
      console.log(`%c ${data.name}`, 'color: yellow')
      console.log(`${data['name']}: `, data['name'].toLowerCase().indexOf(searchTerms['name']) !== -1)
      console.log(`${data['regno']}: `, data['regno'].toString().toLowerCase().indexOf(searchTerms['reg no:']) !== -1)
      console.log(`${data['gender']}: `, data['gender'].toLowerCase().indexOf(searchTerms['gender']) !== -1)
      console.log(`${data['dob']}: `, data['dob'].toLowerCase().indexOf(searchTerms['d.o.b']) !== -1)
      console.log(`${data['joinedAdrs']}: `, data['joinedAdrs'].toLowerCase().indexOf(searchTerms['address']) !== -1)
      console.log(`${data['pincode']}: `, data['pincode'].toString().toLowerCase().indexOf(searchTerms['pincode']) !== -1)
      console.log(`${data['pmobile']}: `, data['pmobile'].toString().toLowerCase().indexOf(searchTerms['personal number']) !== -1)
      console.log(`${data['hmobile']}: `, data['hmobile'].toString().toLowerCase().indexOf(searchTerms['home/office number']) !== -1)
      console.log(`${data['doctor']}: `, data['doctor'].toLowerCase().indexOf(searchTerms['doctor']) !== -1);

      return data['name'].toLowerCase().indexOf(searchTerms['name']) !== -1
        || data['regno'].toString().toLowerCase().indexOf(searchTerms['reg no:']) !== -1
        || data['gender'].toLowerCase().indexOf(searchTerms['gender']) !== -1
        || data['dob'].toLowerCase().indexOf(searchTerms['d.o.b']) !== -1
        || data['joinedAdrs'].toLowerCase().indexOf(searchTerms['address']) !== -1
        || data['pincode'].toString().toLowerCase().indexOf(searchTerms['pincode']) !== -1
        || data['pmobile'].toString().toLowerCase().indexOf(searchTerms['personal number']) !== -1
        || data['hmobile'].toString().toLowerCase().indexOf(searchTerms['home/office number']) !== -1
        || data['dept'].toLowerCase().indexOf(searchTerms['department']) !== -1
        || data['doctor'].toLowerCase().indexOf(searchTerms['doctor']) !== -1;

    }
    return filterFunction;
  }
}
