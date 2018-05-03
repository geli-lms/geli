import * as socketIo from 'socket.io';
import {IMessage} from '../../shared/models/IMessage';
import {SocketIOEvent} from './models/SocketIOEvent';

export default class ChatServer {

  private io: socketIo.Server;

  constructor(server: any) {
    this.io = socketIo(server);
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {
      //socket.join()
      socket.on(SocketIOEvent.MESSAGE, (message: IMessage) => {
        this.io.in(message.room).emit(SocketIOEvent.MESSAGE, message);
      });
    });
  }
}
