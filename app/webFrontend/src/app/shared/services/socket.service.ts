import { Injectable } from '@angular/core';
import {IMessage} from '../../../../../../shared/models/IMessage';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import {SocketIOEvent} from '../../../../../../shared/models/SoketIOEvent';


@Injectable()
export class SocketService {
  public socket;
  private readonly SERVER_URL = 'http://localhost:3030'; // TODO: Change this

  public initSocket(): void {
    this.socket = socketIo(this.SERVER_URL);
  }

  public send(message: IMessage): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<IMessage> {
    return new Observable<IMessage>(observer => {
      this.socket.on('message', (data: IMessage) => observer.next(data));
    });
  }

  public onEvent(event: SocketIOEvent): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

}
