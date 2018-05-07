import * as socketIo from 'socket.io';
import {IMessage} from '../../shared/models/IMessage';
import {SocketIOEvent} from './models/SocketIOEvent';
import {Message} from './models/Message';

export default class ChatServer {

  private io: socketIo.Server;

  constructor(server: any) {
    this.io = socketIo(server, {path: '/chat'});
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {

      const queryParam: any = socket.handshake.query;

      // TODO: check  if room exist before  joining it
      socket.join(queryParam.room);

      socket.on(SocketIOEvent.MESSAGE, (message: IMessage) => this.onMessage(message, queryParam))
    });
  }

  onMessage (message: IMessage, queryParam: any) {
    // save Message into database
    Message.create(message);
    this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, message);
  }
}
