import { Component, OnInit } from '@angular/core';
import { RecordService } from '../service/record.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  editForm = new FormGroup({
    regno: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pmobile: new FormControl('', [Validators.required]),
    hmobile: new FormControl(''),
    dept: new FormControl('', [Validators.required]),
    doctor: new FormControl('', [Validators.required])
  });

  editMode: boolean = false;
  forEditRows: any = [];
  public depts = ['Gastroenterology', 'Cardiology', 'Dental', 'Dermatology', 'Endocrinology', 'ENT', 'Diabetologist', 'General Medicine', 'General Medicine',
  'Nephrology', 'Neurology', 'Obstetrics & Gynecology', 'Oncology & Radiation Oncology', 'Ophthalmology', 'Orthopaedics', 'Pathology', 'Radiology', 'Urology'];
  public doctors = ['Dr. Benjamin Richards', 'Dr. Lewis Frank'];
  dataSource: MatTableDataSource<any>;
  public records = [];
  displayedColumns: string[] = ['regno','name', 'gender', 'dob', 'address', 'pmobile', 'hmobile', 'dept', 'doctor', 'edit', 'delete'];
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

  constructor(private recService: RecordService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.records = this.recService.fetchRecords();
    console.table(this.records);
    this.recService.editRecListener().subscribe(response => {
      this.editMode = false;
      this.forEditRows = [];
      console.table(response.records);
      this.records = response.records;
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

  onEdit(record) {
    this.editMode = true;
    this.forEditRows = [record];
    let index = this.forEditRows.indexOf(record);
    console.log("INDEX: ", index);
    this.editForm.setValue(this.forEditRows[index]);
    console.log("to edit: ", record)
  }

  onDelete(record) {
    console.log("to delete: ", record)
    this.recService.deleteRecord(record.regno);
  }

  onSaveForm() {
    console.log("FORM: ",this.editForm.value);
    this.recService.editRecord(this.editForm.value);
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
