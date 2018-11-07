import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ChatService} from '../../shared/services/chat.service';
import {UserService} from '../../shared/services/user.service';
import {
  ISocketIOMessagePost,
  ISocketIOMessageMeta,
  SocketIOMessageType
} from '../../../../../../shared/models/messaging/ISocketIOMessage';


@Component({
  selector: 'app-messaging-input-field',
  templateUrl: './messaging-input-field.component.html',
  styleUrls: ['./messaging-input-field.component.scss']
})
export class MessagingInputFieldComponent implements OnInit {
  @Input() parentMessageId;
  @Input() room: string;
  @Input() chatName: string;
  showEmojiPicker = false;
  caretPos = 0;

  form = new FormGroup({
    message: new FormControl('')
  });

  constructor(private chatService: ChatService, private dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
  }

  getCaretPos(msgTextArea) {
    if (msgTextArea.selectionStart || msgTextArea.selectionStart === '0') {
      this.caretPos = msgTextArea.selectionStart + 1;
    }
  }

  onClick(msgTextArea) {
    this.getCaretPos(msgTextArea);
  }

  /**
   * Post the message if the user have a chatName
   * otherwise request user to enter a chatName first
   */
  onEnter(event: KeyboardEvent, msgTextArea): void {
    this.getCaretPos(msgTextArea);
    if (event.keyCode === 13 && event.ctrlKey) {
      this.postMessage();
    }
  }

  /**
   * send message chatServer
   * and reset form
   */
  postMessage(): void {
    const msg = this.form.getRawValue().message;
    if (msg.trim().length < 0) {
      return;
    }

    const meta: ISocketIOMessageMeta = {
      type: this.parentMessageId ? SocketIOMessageType.COMMENT : SocketIOMessageType.MESSAGE,
      parent: this.parentMessageId
    };

    const socketIOMessagePost: ISocketIOMessagePost = {
      meta: meta,
      content: this.form.getRawValue().message,
      room: this.room
    };

    this.chatService.send(socketIOMessagePost);
    this.form.setValue({
      message: ''
    });
  }

  onEmojiSelected($event) {
    let message = this.form.getRawValue().message;
    message = message.substr(0, this.caretPos) + $event.emoji.colons + message.substr(this.caretPos);
    this.form.setValue({
      message: message
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

}
