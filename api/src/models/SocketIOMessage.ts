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

interface ISocketIOMessage {
  meta: ISocketIOMessageMeta;
  message: IMessage;
}

export {ISocketIOMessage, ISocketIOMessageMeta, SocketIOMessageType};
