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

// A safe IMessage subset for display in the front-end.
export interface IMessageDisplay {
  _id: any;
  content: string;
  room: string;
  chatName: string;
  comments: IMessageDisplay[];
  updatedAt?: string;
  createdAt?: string;
}
