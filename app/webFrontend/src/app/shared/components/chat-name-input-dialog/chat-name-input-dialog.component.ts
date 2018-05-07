import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-chat-name-input-dialog',
  templateUrl: './chat-name-input-dialog.component.html',
  styleUrls: ['./chat-name-input-dialog.component.scss']
})
export class ChatNameInputDialogComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<ChatNameInputDialogComponent>) {
  }

  ngOnInit() {
  }

  saveName () {
    const { name }= this.form.value;
    if(name.trim().length !== 0){
      this.dialogRef.close(name);
    }
  }
}
