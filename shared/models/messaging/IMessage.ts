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
