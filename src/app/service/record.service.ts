import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class RecordService {

  private records = [
    {name: 'Harry James Potter', gender: 'Male', dob: '02/01/1987', address: '4 Privet Drive, Surrey, 680012', mobile: 9876543201, dept: 'Onchology', doctor: 'Dr. Benjamin Richards'},
    {name: 'Lilly James Potter', gender: 'Female', dob: '02/01/1960', address: '4 Privet Drive, Surrey, 680012', mobile: 9234567801, dept: 'Cardiology', doctor: 'Dr. Lewis Frank'},
  ]

  private personal = { };
  private contact = { };

  constructor() {}

  fetchRecords() {
    return this.records.slice();
  }

  saveRecords(record) {
    this.records.push(record);
  }

  onSavePersonal(pers) {
    let regno: number = Math.floor(Math.random() * Math.floor(1000000));
    pers['regno'] = regno;
    console.log("%c Personal : " ,'color: red', pers)
    this.personal = pers;
  }

  onSaveContact(cont) {
    console.log("%c Conatct : " ,'color: red', cont)
    this.contact = cont;
  }

  onFetchPersonal() {
    return this.personal;
  }

  onFetchContact() {
    return this.contact;
  }
}
