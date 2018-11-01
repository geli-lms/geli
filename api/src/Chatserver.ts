import * as socketIo from 'socket.io';
import {SocketIOEvent} from './models/SocketIOEvent';
import {IMessageModel, Message} from './models/Message';
import * as jwt from 'jsonwebtoken';
import config from './config/main';
import {User} from './models/User';
import {ChatRoom} from './models/ChatRoom';
import {ISocketIOMessage, SocketIOMessageType} from './models/SocketIOMessage';


export default class ChatServer {

  private io: socketIo.Server;

  constructor(server: any) {
    this.io = socketIo(server, {path: '/chat'});

    this.io.use((socket: any, next) => {
      const token = socket.handshake.headers.cookie.split(' ')[1];
      const room: any = socket.handshake.query.room;

      jwt.verify(token, config.secret, (err: any, decoded: any) => {
        if (err) {
          next(new Error('not authorized'));
        } else if (this.canConnect(decoded._id, room)) {
          next();
        } else {
          next(new Error('not authorized'));
        }
      });
    });
  }


  /**
   * verify if the  given userId and room exist.
   * @param {string} userId
   * @param {string} room
   */
  async canConnect(userId: string, room: string) {
    const _user = await User.findById(userId);
    const _room = await ChatRoom.findById(room);

    return _user && _room;
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {
      const queryParam: any = socket.handshake.query;
      socket.join(queryParam.room);

      socket.on(SocketIOEvent.MESSAGE, (message: ISocketIOMessage) => this.onMessage(message, queryParam));
    });
  }

  async onMessage(socketIOMessage: ISocketIOMessage, queryParam: any) {
    if (socketIOMessage.meta.type === SocketIOMessageType.COMMENT) {
      let foundMessage: IMessageModel = await Message.findById(socketIOMessage.meta.parent);

      if (foundMessage) {
        foundMessage.comments.push(socketIOMessage.message);
        foundMessage = await foundMessage.save();
        socketIOMessage.message = foundMessage.comments.pop();
        this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
      }
    } else {
      let newMessage = new Message(socketIOMessage.message);
      newMessage = await newMessage.save();
      socketIOMessage.message = newMessage;
      this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
    }
  }
}
