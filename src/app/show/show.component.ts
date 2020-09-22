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

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  editMode: boolean = false;
  forEditRows: any = [];
  searchValue: string = null;
  isFilterChecked: boolean;
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
    console.log("pushing: ",address)
   this.addresses().push(this.newAddress(address));
  }

  removeAddress(i: number) {
   this.addresses().removeAt(i);
   console.log("To remove: ",this.addresses().length);
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
        if(index!=0)
          joinedAdrs += ', ';
        joinedAdrs+= address.address;
      })
      record['joinedAdrs'] = joinedAdrs
      console.log(joinedAdrs);
    })
  }

  onEdit(record) {
    console.log(record);
    this.editMode = true;
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
      if(result=== 'yes') {
        this.editMode = false;
        this.forEditRows = [];
      }
    });
  }

  search(value: string) {
    this.dataSource.filter = '';
    this.isFilterChecked = false;
    this.searchValue = value.trim().toLocaleLowerCase();
    console.log("Search value: ", this.searchValue);
  }

  onFilterData(checked: boolean) {
    console.log("Checking: ", checked);
    this.dataSource.filter = checked ? this.searchValue : null;
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
