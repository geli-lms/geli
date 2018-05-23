import * as socketIo from 'socket.io';
import {IMessage} from '../../shared/models/IMessage';
import {SocketIOEvent} from './models/SocketIOEvent';
import {Message} from './models/Message';
import * as jwt from 'jsonwebtoken';
import config from './config/main';
import {User} from './models/User';
import {Course} from './models/Course';

export default class ChatServer {

  private io: socketIo.Server;

  constructor(server: any) {
    this.io = socketIo(server, {path: '/chat'});

    /*this.io.use((socket: any, next) => {
      const token = socket.handshake.headers.authToken;
      const room: any = socket.handshake.query.room;

      jwt.verify(token, config.secret, (err: any, decoded: any) => {
        if (err || !decoded) {
          next(new Error('not authorized'));
        } else if(this.canConnect(decoded._id, room)) {
          next();
        }else  {
          next(new Error('not authorized'));
        }
      });
    })*/
  }


  /**
   * verify if the  given userId and room exist.
   * @param {string} userId
   * @param {string} room
   */
  async canConnect(userId: string, room: string) {
    const _user = await User.findById(userId);
    const _room = await Course.findById(room);

    return _user && _room;
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {

      const queryParam: any = socket.handshake.query;

      // TODO: check  if room exist before  joining it
      socket.join(queryParam.room);

      socket.on(SocketIOEvent.MESSAGE, (message: IMessage) => this.onMessage(message, queryParam))
    });
  }

  onMessage(message: IMessage, queryParam: any) {
    Message.create(message);
    this.io.in(queryParam.room).emit(SocketIOEvent.MESSAGE, message);
  }
}
