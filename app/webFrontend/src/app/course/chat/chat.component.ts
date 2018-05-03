import {Component, Input, OnInit} from '@angular/core';
import {IMessage} from '../../../../../../shared/models/IMessage';
import {SocketIOEvent} from '../../../../../../shared/models/SoketIOEvent';
import {SocketService} from '../../shared/services/socket.service';
import {MessageService} from '../../shared/services/message.service';
import {UserService} from '../../shared/services/user.service';
import {Message} from '../../models/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() room: string;
  messages: IMessage[] = [];
  ioConnection: any;
  inputValue: string = null;

  constructor(private messageService: MessageService, private socketService: SocketService, private userService: UserService) { }

  async ngOnInit() {
    const queryParam = {room: this.room};
    this.messages = await this.messageService.getMessages(queryParam);
    this.initSocketConnection();
  }


  private initSocketConnection (): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: IMessage) => {
        this.messages.push(message);
      });


    this.socketService.onEvent(SocketIOEvent.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(SocketIOEvent.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private sendMessage() {
    const message = new Message(this.userService.user, this.inputValue, this.room, true);
    this.socketService.send(message);
    this.inputValue = null;
  }

}
