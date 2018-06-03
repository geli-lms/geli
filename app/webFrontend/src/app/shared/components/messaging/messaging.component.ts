import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MessageService} from '../../services/message.service';
import {ChatService} from '../../services/chat.service';
import {IMessage} from '../../../../../../../shared/models/Messaging/IMessage';
import {SocketIOEvent} from '../../../../../../../shared/models/Messaging/SoketIOEvent';
import 'rxjs/add/operator/do';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import {ISocketIOMessage, SocketIOMessageType} from '../../../../../../../shared/models/Messaging/ISocketIOMessage';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {

  @Input() room: string;
  @Input() mode: string;
  @Input() loadMsgOnScroll = true;
  // number of messages to load
  @Input() limit = 20;

  messages: IMessage[] = [];
  // number of message in a given room
  messageCount: number;
  ioConnection: any;
  // callback for the infinite-scroll
  scrollCallback: any;

  constructor(
    private messageService: MessageService,
    private chatService: ChatService
  ) {

    this.scrollCallback = this.loadMsgOnScroll ? this.loadMoreMsg.bind(this) : null;
  }


  ngOnInit() {
    this.init();
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

  /**
   * initialise WebSocket connection
   *  and applies listeners
   */
  initSocketConnection(): void {
    this.chatService.initSocket(this.room);

    this.ioConnection = this.chatService.onMessage()
      .subscribe(this.handleNewMessage.bind(this));

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
   * handle SocketIO incoming message
   * @param {ISocketIOMessage} socketIOMessage
   */
  handleNewMessage(socketIOMessage: ISocketIOMessage): void {
    if (socketIOMessage.meta.type === SocketIOMessageType.COMMENT) {
      let match = this.messages.find((msg: IMessage) => {
        return msg._id === socketIOMessage.meta.parent
      });

      if (match) {
        match.comments.push(socketIOMessage.message);
      }
    } else {
      this.messages.push(socketIOMessage.message);
    }
  }

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
    if (this.messages.length === this.messageCount) {
      this.loadMsgOnScroll = false;
    }
  }
}
