import {Component, Input, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MessageService} from '../../services/message.service';
import {ChatService} from '../../services/chat.service';
import {IMessage} from '../../../../../../../shared/models/IMessage';
import {SocketIOEvent} from '../../../../../../../shared/models/SoketIOEvent';
import {MatDialog} from '@angular/material';
import {ChatNameInputDialogComponent} from '../chat-name-input-dialog/chat-name-input-dialog.component';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() room: string;
  chatName: string;
  chatNameSubscription: Subscription;
  messages: IMessage[] = [];
  messageCount: number;
  ioConnection: any;
  inputValue: string = null;
  loadMsgOnScroll = true;

  constructor(private messageService: MessageService, private chatService: ChatService, private userService: UserService, public dialog: MatDialog) {
    this.chatNameSubscription = this.chatService.chatName$.subscribe(chatName => {
      this.chatName = chatName;
    })
  }

  ngOnInit() {
    console.log('init', this.room)
    this.init();
  }

  async init() {
    if (this.room) {
      const res = await this.messageService.getMessageCount({room: this.room});
      this.messageCount = res.count;
      this.getMessages();
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


  ngOnDestroy() {
    this.chatNameSubscription.unsubscribe();
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


  onEnter() {
    if (!this.chatName) {
      const temporaryNameDialog = this.dialog.open(ChatNameInputDialogComponent);
      temporaryNameDialog.afterClosed()
        .subscribe((chatName: string) => {
          this.chatService.setChatName(chatName);
          this.postMessage();
        });
    } else {
      this.postMessage();
    }
  }

  postMessage = () => {
    const message = {
      chatName: this.chatName,
      content: this.inputValue,
      room: this.room,
      author: this.chatName ? {_id: this.userService.user._id} : this.userService.user  // TODO: send only required information
    };
    this.chatService.send(message);
    this.inputValue = null;
  };

  async getMessages() {
    const queryParam = {
      room: this.room,
      skip: this.messages.length,
      limit: 10,
    };

    const furtherMessages = await this.messageService.getMessages(queryParam);
    this.messages = this.messages.concat(furtherMessages).reverse();
    if (this.messages.length === this.messageCount) {
      this.loadMsgOnScroll = false;
    }
  }

}
