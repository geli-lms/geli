import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatNameInputComponent} from '../chat-name-input/chat-name-input.component';
import {ChatService} from '../../services/chat.service';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {
  ISocketIOMessage,
  ISocketIOMessageMeta,
  SocketIOMessageType
} from '../../../../../../../shared/models/Messaging/ISocketIOMessage';
import {IMessage} from '../../../../../../../shared/models/Messaging/IMessage';

@Component({
  selector: 'app-messaging-input-field',
  templateUrl: './messaging-input-field.component.html',
  styleUrls: ['./messaging-input-field.component.scss']
})
export class MessagingInputFieldComponent implements OnInit {
  @Input() parentMessageId;
  @Input() room: string;

  chatName: string;
  form = new FormGroup({
    message: new FormControl('')
  });

  constructor(private chatService: ChatService, private dialog: MatDialog, private userService: UserService,) {
    this.chatService.chatName$.subscribe(chatName => {
      this.chatName = chatName;
    });
  }

  ngOnInit() {
  }


  /**
   * Post the message if the user have a chatName
   * otherwise request user to enter a chatName first
   */
  onEnter(event: KeyboardEvent): void {
    const message = this.form.getRawValue().message;
    if (event.keyCode === 13 && event.ctrlKey && message.trim().length > 0) {
      if (!this.chatName) {
        const dialogRef = this.dialog.open(ChatNameInputComponent, {
          data: {chatName: this.chatName}
        });

        dialogRef.afterClosed()
          .subscribe(() => {
            this.postMessage();
          });
      } else {
        this.postMessage();
      }
    }
  }

  /**
   * send message chatServer
   * and reset form
   */
  postMessage(): void {
    const meta: ISocketIOMessageMeta = {
      type: this.parentMessageId ?  SocketIOMessageType.COMMENT :  SocketIOMessageType.MESSAGE,
      parent: this.parentMessageId
    };

    const message: IMessage = {
      _id: undefined,
      chatName: this.chatName,
      content: this.form.getRawValue().message,
      room: this.room,
      author: this.userService.user._id,
      comments: []
    };

    const socketIOMessage: ISocketIOMessage = {
      meta: meta,
      message: message
    };

    this.chatService.send(socketIOMessage);
    this.form.reset();
  }

}
