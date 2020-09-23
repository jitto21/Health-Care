import { Component, OnInit, ViewChild } from '@angular/core';
import { RecordService } from '../service/record.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../dialog/message.dialog';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  editForm: FormGroup;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  editMode: boolean = false;
  forEditRows: any = [];
  searchValue: string = '';
  isFilterChecked: boolean;
  selected = "ALL";
  matchSelect = new FormControl('ALL');
  filterValues = {
    'name': '',
    'reg no:': '',
    'gender': '',
    'd.o.b': '',
    'address': '',
    'pincode': '',
    'personal number': '',
    'home/office number': '',
    'department': '',
    'doctor': ''
  };
  public depts = ['Gastroenterology', 'Cardiology', 'Dental', 'Dermatology', 'Endocrinology', 'ENT', 'Diabetologist', 'General Medicine', 'General Medicine',
    'Nephrology', 'Neurology', 'Obstetrics & Gynecology', 'Oncology & Radiation Oncology', 'Ophthalmology', 'Orthopaedics', 'Pathology', 'Radiology', 'Urology'];
  public doctors = ['Dr. Benjamin Richards', 'Dr. Lewis Frank'];
  public records: any = [];
  dataSource = new MatTableDataSource(this.records);
  displayedColumns: string[] = ['regno', 'name', 'gender', 'dob', 'address', 'pincode', 'pmobile', 'hmobile', 'dept', 'doctor', 'edit', 'delete'];
  // labels = [
  //   'Reg No:',
  //   'Name',
  //   'Gender',
  //   'D.O.B',
  //   'Address',
  //   'Edit',
  //   'Delete'
  // ];
  // displayedColumns1 = [];

  constructor(private recService: RecordService, private _snackBar: MatSnackBar, private fb: FormBuilder, public dialog: MatDialog) {
    this.editForm = this.fb.group({
      regno: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      addresses: this.fb.array([], [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
      pmobile: new FormControl('', [Validators.required]),
      hmobile: new FormControl(''),
      dept: new FormControl('', [Validators.required]),
      doctor: new FormControl('', [Validators.required])
    })

    this.dataSource.filterPredicate = this.createFilterAll();
  }

  addresses(): FormArray {
    return this.editForm.get('addresses') as FormArray;
  }

  newAddress(address: string): FormGroup {
    return this.fb.group({
      address: [address, [Validators.required]]
    })
  }

  addAddress(address: string) {
    console.log("pushing: ", address)
    this.addresses().push(this.newAddress(address));
  }

  removeAddress(i: number) {
    this.addresses().removeAt(i);
    console.log("To remove: ", this.addresses().length);
  }

  ngOnInit(): void {
    this.fetchRecordsandJoinAddress(); //to fetch records and then join addresses
    console.table(this.records);
    this.recService.editRecListener().subscribe(response => { //subscribing for edit and delete responses
      this.editMode = false;
      this.forEditRows = [];
      console.table(response.records);
      this.fetchRecordsandJoinAddress(); //to fetch records and then join addresses
      let msg = response.op === 'edit' ? 'Updated' : 'Deleted';
      let panel = response.op === 'edit' ? ['mat-toolbar', 'mat-primary'] : ['mat-toolbar', 'mat-warn'];
      this._snackBar.open(`Record ${msg} Successfully`, '', {
        duration: 3000,
        panelClass: panel
      });
    })

    //subscribing to match select's value changes. Activates whenever the select is changed

    this.matchSelect.valueChanges.subscribe(name => {
      this.selected = name;
      console.log(`%c Select Changed ${this.selected}`, 'color: brown')
      Object.keys(this.filterValues).forEach(filterPpty => {
        this.filterValues[filterPpty] = '';
      }) // clearing all filter values

      console.log("clearing all filter values ", this.filterValues);

      if (name === 'ALL') { //assign each object in filterValues with searchValue
        this.dataSource.filterPredicate = this.createFilterAll(); //assigning All filter
        console.log("all selected")
        Object.keys(this.filterValues).forEach(filterPpty => {
          this.filterValues[filterPpty] = this.searchValue;
        })
      }

      if (name !== 'ALL') {
        this.dataSource.filterPredicate = this.createFilter(); //assigning different filter
        console.log(this.dataSource.filterPredicate);
        this.filterValues[name.toLocaleLowerCase()] = this.searchValue;
      }
      console.log("NEW filter values ", this.filterValues);
      this.onFilterData(this.isFilterChecked) //filter the data when select is changed
      // console.log(this.filterValues);
      // this.dataSource.filter = JSON.stringify(this.filterValues);
    })
    // this.transpose();
    // this.fillLabels();
  }

  fetchRecordsandJoinAddress() {
    this.records = this.recService.fetchRecords();
    this.dataSource.data = this.records;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    })
    this.joinAddress();
  }

  joinAddress() {
    this.records.forEach(record => { //each record
      let joinedAdrs = '';
      record.addresses.forEach((address, index) => { //each address eg: address 1 address 2 and so on..
        if (index != 0)
          joinedAdrs += ', ';
        joinedAdrs += address.address;
      })
      record['joinedAdrs'] = joinedAdrs
      console.log(joinedAdrs);
    })
  }

  onEdit(record) {
    console.log(record);
    this.editMode = true;
    this.searchValue = '';
    Object.keys(this.filterValues).forEach(filterPpty => {
      this.filterValues[filterPpty] = '';
    })
    this.forEditRows = [record];
    let index = this.forEditRows.indexOf(record);
    console.log("INDEX: ", index);
    while (this.addresses().length !== 0) { //to empty the address form array
      this.removeAddress(0);
    }
    console.log(this.editForm.get('addresses'))
    record.addresses.forEach(address => {
      console.log(address);
      this.addAddress(address.address); //to add each address to form array
    })
    this.editForm.patchValue(this.forEditRows[index]);
    console.log("to edit: ", record)
  }

  onDelete(record) {
    console.log("to delete: ", record)
    this.recService.deleteRecord(record.regno);
  }

  onSaveForm() {
    console.log("FORM: ", this.editForm.value);
    this.recService.editRecord(this.editForm.value);
  }

  onDiscard() {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '50vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'yes') {
        this.editMode = false;
        this.forEditRows = [];
      }
    });
  }

  search(value: string) {
    // this.dataSource.filter = '';
    // this.isFilterChecked = false;
    this.searchValue = value.trim().toLocaleLowerCase();
    console.log("Search value: ", this.searchValue);
    if (this.selected !== 'ALL') { this.filterValues[this.selected.toLocaleLowerCase()] = this.searchValue; }
    console.log(this.filterValues);
    if (this.selected === 'ALL') { //assign each object in filterValues with searchValue
      console.log("all selected, typing in search box")
      Object.keys(this.filterValues).forEach(filterPpty => {
        this.filterValues[filterPpty] = this.searchValue;
      })
    }
    if (this.isFilterChecked) { this.onFilterData(this.isFilterChecked); }
    // this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  onFilterData(checked: boolean) {
    console.log("checked arg value: ", checked);
    this.isFilterChecked = checked;
    // if(this.selected === 'ALL') {
    //   console.log("filtering: ALL");
    //   return this.dataSource.filter = checked ? this.searchValue : null;
    // }
    // console.log(`filtering: ${this.selected}`);
    // this.filterValues[this.selected.toLocaleLowerCase()] = this.selected
    console.log(JSON.stringify(this.filterValues));
    this.dataSource.filter = this.isFilterChecked ? JSON.stringify(this.filterValues) : '';
  }

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

  // transpose() {
  //   let transposedData = [];
  //   for (let column = 0; column < this.displayedColumns.length; column++) {
  //     transposedData[column] = {
  //       label: this.labels[column]
  //     };
  //     for (let row = 0; row < this.records.length; row++) {
  //       transposedData[column][`column${row}`] = this.records[row][this.displayedColumns[column]];
  //     }
  //   }
  //   this.dataSource = new MatTableDataSource(transposedData);
  //   console.table(transposedData);
  // }

  // fillLabels() {
  //   this.displayedColumns1 = ['label'];
  //   for (let i = 0; i < this.records.length; i++) {
  //     this.displayedColumns1.push('column' + i);
  //   }
  //   console.log(this.displayedColumns1);
  // }

}
