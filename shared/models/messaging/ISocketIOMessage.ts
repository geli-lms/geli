import {IMessage} from './IMessage';

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
