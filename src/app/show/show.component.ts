import { Component, OnInit } from '@angular/core';
import { RecordService } from '../service/record.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  public records = [];
  displayedColumns: string[] = ['name', 'gender', 'dob', 'address', 'edit', 'delete'];

  constructor(private recService: RecordService) { }

  ngOnInit(): void {
    this.records = this.recService.fetchRecords();
    console.table(this.records);
  }

  onEdit(record) {
    console.log("to edit: ", record)
  }

  onDelete(record) {
    console.log("to delete: ", record)
  }

}
