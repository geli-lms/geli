export interface IMessage {
  _id: any;
  content: string;
  visible?: boolean;
  room: string;
  chatName: string;
  comments: IMessage[];
  author: any;
  updatedAt?: string;
  createdAt?: string;
}


enum SocketIOMessageType {
  COMMENT = 'comment',
  MESSAGE = 'message'
}

interface ISocketIOMessageMeta {
  type: SocketIOMessageType;
  parent: string;
}


// This is what clients receive.
interface ISocketIOMessage {
  meta: ISocketIOMessageMeta;
  message: IMessage;
}

// This is what's "posted" by the client to the ChatServer.
interface ISocketIOMessagePost {
  meta: ISocketIOMessageMeta;
  content: string;
}

export {ISocketIOMessagePost, ISocketIOMessage, ISocketIOMessageMeta, SocketIOMessageType};
