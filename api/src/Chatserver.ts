import * as socketIo from 'socket.io';
import {IMessage} from '../../shared/models/IMessage';
import {SocketIOEvent} from '../../shared/models/SoketIOEvent';

export default class ChatServer {

  private io: socketIo.Server;
  constructor(server: any) {
    this.io = socketIo(server);
  }

  init() {
    this.io.on(SocketIOEvent.CONNECT, (socket: any) => {

      socket.on(SocketIOEvent.JOIN, (data: any) => {
          //const courseId = data.courseId;
           // check if forum for the given course exist.
        /*Forum.findOne({courseId: '5ae9b78bdcf49b0032c47b5c'})
          .then((forum: IForumModel) => {
            socket.forumId = forum._id;
            socket.room = forum.name;
            socket.join(forum.name);
          });*/
        });

      socket.on(SocketIOEvent.MESSAGE, (message: IMessage) => {
        //this.io.in(socket.room).emit('message', message);
        this.io.emit('message', message);
      });
    });
  }
}
