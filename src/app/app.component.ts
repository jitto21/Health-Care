import { Component, OnInit } from '@angular/core';
import { RecordService } from './service/record.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'healthcare';

  constructor(private recServcie: RecordService) {}

  ngOnInit() {
    this.recServcie.refreshFromSession();
  }
}
