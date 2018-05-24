import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MessageService} from '../../services/message.service';
import {ChatService} from '../../services/chat.service';
import {IMessage} from '../../../../../../../shared/models/IMessage';
import {SocketIOEvent} from '../../../../../../../shared/models/SoketIOEvent';
import {MatDialog} from '@angular/material';
import {ChatNameInputComponent} from '../chat-name-input/chat-name-input.component';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {MarkdownService} from '../../services/markdown.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() room: string;
  chatName: string;
  messages: IMessage[] = [];
  messageCount: number;
  ioConnection: any;
  loadMsgOnScroll = true;
  scrollCallback: any;
  limit = 20;
  form = new FormGroup({
    chatName: new FormControl('', Validators.required)
  });

  constructor(
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private chatService: ChatService,
    private userService: UserService,
    public dialog: MatDialog,
    private markdownService: MarkdownService) {


    this.chatService.chatName$.subscribe(chatName => {
      this.chatName = chatName;
    });

    this.scrollCallback = this.loadMoreMsg.bind(this);
  }

  ngOnInit() {
    this.init();
  }

  onEnter(event: KeyboardEvent) {
    if (event.keyCode === 13 && event.ctrlKey && this.form.valid) {
      this.sendMessage();
    }
  }

  async init() {
    if (this.room) {
      const queryParam = {room: this.room, limit: this.limit};
      const res = await this.messageService.getMessageCount(queryParam);
      this.messageCount = res.count;
      this.messages = await this.messageService.getMessages(queryParam);
      this.messages.reverse();
      this.initSocketConnection();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const changedProp = changes[propName];
        this[propName] = changedProp.currentValue;
      }
    }
    this.init()
  }


  initSocketConnection(): void {
    this.chatService.initSocket(this.room);

    this.ioConnection = this.chatService.onMessage()
      .subscribe((message: IMessage) => {
        this.messages.push(message);
      });


    this.chatService.onEvent(SocketIOEvent.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });


    this.chatService.onEvent(SocketIOEvent.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }


  /**
   * Post the message if the user have an chatName
   * otherwise request a chatName first
   */
  sendMessage() {
    if (!this.chatName) {
      const dialogRef = this.dialog.open(ChatNameInputComponent, {
        data: {chatName: ''}
      });

      dialogRef.afterClosed()
        .subscribe((chatName: string) => {
          this.postMessage();
        });
    } else {
      this.postMessage();
    }
  }

  postMessage = () => {
    const message = {
      chatName: this.chatName,
      content: this.form.getRawValue().chatName,
      room: this.room,
      author: this.chatName ? {_id: this.userService.user._id} : this.userService.user
    };

    this.chatService.send(message);
    this.form.reset();
  };

  loadMoreMsg(): Observable<any> {
    const queryParam = {
      room: this.room,
      skip: this.messages.length,
      limit: this.limit
    };

    return fromPromise(this.messageService.getMessages(queryParam)).do(this.processFurtherMessages.bind(this));
  }

  processFurtherMessages(messages: IMessage[]): void {
    this.messages = this.messages.concat(messages).reverse();
    if (this.messages.length == this.messageCount) {
      this.loadMsgOnScroll = false;
    }
  }

}
