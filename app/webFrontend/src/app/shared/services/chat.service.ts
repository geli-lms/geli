import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import {AuthenticationService} from './authentication.service';
import {ISocketIOMessage} from '../../../../../../shared/models/messaging/ISocketIOMessage';
import {SocketIOEvent} from '../../../../../../shared/models/messaging/SoketIOEvent';


@Injectable()
export class ChatService {
  private socket;

  constructor(private authenticationService: AuthenticationService) {
  }

  public initSocket(room: string): void {
    this.socket = socketIo({
      path: '/chat',
      query: {
        room: room,
        authToken: this.authenticationService.token
      }
    });
  }


  public send(socketIOMessage: ISocketIOMessage): void {
    this.socket.emit(SocketIOEvent.MESSAGE, socketIOMessage);
  }

  public onMessage(): Observable<ISocketIOMessage> {
    return new Observable<ISocketIOMessage>(observer => {
      this.socket.on(SocketIOEvent.MESSAGE, (data: ISocketIOMessage) => observer.next(data));
    });
  }

  public onEvent(event: SocketIOEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

}
