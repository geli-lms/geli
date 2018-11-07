import * as socketIo from 'socket.io';
import {SocketIOEvent} from './models/SocketIOEvent';
import {IMessageModel, Message} from './models/Message';
import * as jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import config from './config/main';
import {User} from './models/User';
import {ChatRoom} from './models/ChatRoom';
import {ISocketIOMessagePost, ISocketIOMessage, SocketIOMessageType, IMessage} from './models/SocketIOMessage';

// FIXME: This is currently WIP to fix the #989 issues.
export default class ChatServer {

  private io: socketIo.Server;

  constructor(server: any) {
    this.io = socketIo(server, {path: '/chat'});

    this.io.use((socket: any, next) => {
      // ATM this and the passportJwtStrategyFactory are the only users of the 'cookie' package.
      const token = cookie.parse(socket.handshake.headers.cookie).token;
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
      // ATM this and the passportJwtStrategyFactory are the only users of the 'cookie' package.
      const token = cookie.parse(socket.handshake.headers.cookie).token;
      const tokenPayload = jwt.decode(token);

      const queryParam: any = socket.handshake.query;
      socket.join(queryParam.room);

      socket.on(SocketIOEvent.MESSAGE, (message: ISocketIOMessagePost) => this.onMessage(message, queryParam, tokenPayload));
    });
  }

  async onMessage(socketIOMessagePost: ISocketIOMessagePost, queryParam: any, tokenPayload: any) {
    const message: IMessage = {
      _id: undefined,
      author: tokenPayload._id,
      content: socketIOMessagePost.content,
      room: socketIOMessagePost.room,
      chatName: 'TODO', // FIXME
      comments: []
    };
    const socketIOMessage: ISocketIOMessage = {
      meta: socketIOMessagePost.meta,
      message
    };

    if (socketIOMessagePost.meta.type === SocketIOMessageType.COMMENT) {
      let foundMessage: IMessageModel = await Message.findById(socketIOMessagePost.meta.parent);

      if (foundMessage) {
        foundMessage.comments.push(message);
        foundMessage = await foundMessage.save();
        socketIOMessage.message = foundMessage.comments.pop();
        this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
      }
    } else {
      let newMessage = new Message(message);
      newMessage = await newMessage.save();
      socketIOMessage.message = newMessage;
      this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
    }
  }
}
