import {IMessageDisplay} from './IMessage';

export enum SocketIOMessageType {
  COMMENT = 'comment',
  MESSAGE = 'message'
}

export interface ISocketIOMessageMeta {
  type: SocketIOMessageType;
  parent: string;
}

// This is what clients receive.
export interface ISocketIOMessage {
  meta: ISocketIOMessageMeta;
  message: IMessageDisplay;
}

// This is what's "posted" by the client to the ChatServer.
export interface ISocketIOMessagePost {
  meta: ISocketIOMessageMeta;
  content: string;
}
