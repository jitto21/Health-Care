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
  filterValues = { 'name': '', 'reg no:': '', 'gender': '', 'd.o.b': '', 'address': '', 'pincode': '', 'personal number': '', 'home/office number': '', 'department': '', 'doctor': '' };
  public depts = [];
  public doctors = [];
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

    this.dataSource.filterPredicate = this.recService.createFilterAll();
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
    this.depts = this.recService.fetchDocsandDepts().depts;
    this.doctors = this.recService.fetchDocsandDepts().doctors;
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
        this.dataSource.filterPredicate = this.recService.createFilterAll(); //assigning All filter
        console.log("all selected")
        Object.keys(this.filterValues).forEach(filterPpty => {
          this.filterValues[filterPpty] = this.searchValue;
        })
      }

      if (name !== 'ALL') {
        this.dataSource.filterPredicate = this.recService.createFilter(); //assigning different filter
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

  //Fetch Records from Service file and join addresses

  fetchRecordsandJoinAddress() {
    this.records = this.recService.fetchRecords();
    this.dataSource.data = this.records;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    })
    this.joinAddress();
  }

  //Join each address object in Address Array to a String Variable

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

  //Edit Mode

  onEdit(record) {
    console.log(record);
    this.editMode = true;
    /* START- resetting filters  */

    this.searchValue = '';
    Object.keys(this.filterValues).forEach(filterPpty => {
      this.filterValues[filterPpty] = '';
    })
    this.dataSource.filter = '';

    /* END */
    this.forEditRows = [record];
    let index = this.forEditRows.indexOf(record);
    console.log("INDEX: ", index);
    while (this.addresses().length !== 0) { //to empty the address form array
      this.removeAddress(0);
    }
    record.addresses.forEach(address => {
      this.addAddress(address.address); //to add each address to form array
    })
    this.editForm.patchValue(this.forEditRows[index]);
    console.log("to edit: ", record)
  }

  //deleting a record

  onDelete(record) {
    console.log("to delete: ", record)
    this.recService.deleteRecord(record.regno);
  }

  /*saving the Edited Form*/

  onSaveForm(orgRecord) {
    this.recService.editRecord(this.editForm.value, orgRecord);
  }

  //discard changes on Edit

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

  //when user types in the search filed

  search(value: string) {
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
  }

  onFilterData(checked: boolean) {
    console.log("checked arg value: ", checked);
    this.isFilterChecked = checked;
    console.log(JSON.stringify(this.filterValues));
    this.dataSource.filter = this.isFilterChecked ? JSON.stringify(this.filterValues) : '';
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
