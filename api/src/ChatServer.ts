import * as socketIo from 'socket.io';
import {SocketIOEvent} from './models/SocketIOEvent';
import {IMessageModel, Message} from './models/Message';
import * as jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import config from './config/main';
import {User, IUserModel} from './models/User';
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

      jwt.verify(token, config.secret, async (err: any, decoded: any) => {
        if (err || !await this.canConnect(decoded._id, room)) {
          next(new Error('Not authorized'));
        }
        socket.tokenPayload = decoded;
        next();
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

  async obtainChatName (user: IUserModel, room: string) {
    const lastMessage = await Message.findOne({room: room, author: user}).sort({createdAt: -1});
    if (lastMessage) {
      return lastMessage.chatName;
    } else {
      // Note: We probably should improve the random name generation, especially for better readability.
      return user.role + Date.now();
    }
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {
      const userId = socket.tokenPayload._id;
      const room = socket.handshake.query.room;
      socket.join(room);
      socket.on(SocketIOEvent.MESSAGE, (message: ISocketIOMessagePost) => this.onMessage(message, userId, room));
    });
  }

  async onMessage(socketIOMessagePost: ISocketIOMessagePost,  userId: string, room: string) {
    const message: IMessage = {
      _id: undefined,
      content: socketIOMessagePost.content,
      author: userId,
      room,
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
        this.io.in(room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
      }
    } else {
      let newMessage = new Message(message);
      newMessage = await newMessage.save();
      socketIOMessage.message = newMessage;
      this.io.in(room).emit(SocketIOEvent.MESSAGE, socketIOMessage);
    }
  }
}
