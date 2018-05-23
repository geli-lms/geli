import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-chat-name-input-dialog',
  templateUrl: './chat-name-input.component.html',
  styleUrls: ['./chat-name-input.component.scss']
})
export class ChatNameInputComponent implements OnInit {
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<ChatNameInputComponent>, private chatService: ChatService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.form = new FormGroup({
      name: new FormControl(data.chatName || '', Validators.required)
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const {name} = this.form.value;
    if (name.trim().length !== 0) {
      this.chatService.setChatName(name.trim());
      this.dialogRef.close();
    }
  }
}
