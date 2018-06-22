import {IMessage} from './IMessage';

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
