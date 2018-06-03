import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';
import {ISocketIOMessage} from '../../../../../../shared/models/Messaging/ISocketIOMessage';
import {SocketIOEvent} from '../../../../../../shared/models/Messaging/SoketIOEvent';


@Injectable()
export class ChatService {
  socket;
  chatName$ = new BehaviorSubject<string>(null);
  private readonly SERVER_URL =  environment.serverUrl + ':' + environment.serverPort;


  constructor(private authenticationService: AuthenticationService) {
    const chatName = localStorage.getItem('chatName');
    if (chatName) {
      this.chatName$.next(chatName);
    }
  }

  public initSocket(room: string): void {
    this.socket = socketIo(this.SERVER_URL, {
      path: '/chat',
      query: {
        room: room,
        authToken: this.authenticationService.token
      }
    });
  }

  public setChatName(chatName: string): void {
    localStorage.setItem('chatName', chatName);
    this.chatName$.next(chatName);
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
