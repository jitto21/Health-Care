import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'message-dialog',
  templateUrl: 'message.dialog.html',
  styles: ['h1 {text-align: center}']
})
export class MessageDialog {

  constructor(public dialogRef: MatDialogRef<MessageDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
