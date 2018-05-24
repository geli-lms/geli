import { Injectable } from '@angular/core';
import {IMessage} from '../../../../../../shared/models/IMessage';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import {SocketIOEvent} from '../../../../../../shared/models/SoketIOEvent';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthenticationService} from './authentication.service';
import {environment} from '../../../environments/environment';


@Injectable()
export class ChatService {
  socket;
  chatName$ = new BehaviorSubject<string>(null);
  private readonly SERVER_URL =  environment.serverUrl + ':' + environment.serverPort;


  constructor(private authenticationService: AuthenticationService) {
    const chatName = localStorage.getItem('chatName');
    if(chatName){
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
    localStorage.setItem('chatName', chatName)
    this.chatName$.next(chatName);
  }

  public send(message: any): void {
    this.socket.emit(SocketIOEvent.MESSAGE, message);
  }

  public onMessage(): Observable<IMessage> {
    return new Observable<IMessage>(observer => {
      this.socket.on(SocketIOEvent.MESSAGE, (data: IMessage) => observer.next(data));
    });
  }

  public onEvent(event: SocketIOEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

}
