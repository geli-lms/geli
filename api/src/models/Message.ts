import * as mongoose from 'mongoose';
import {IMessage} from '../../../shared/models/messaging/IMessage';
import {ChatRoom} from './ChatRoom';

interface IMessageModel extends IMessage, mongoose.Document {
}

const messageSchema = new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    chatName: {
      type: String,
    },
    content: {
      type: 'string',
      required: true
    },
    visible: {
      type: Boolean,
      default: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ChatRoom'
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
        ret.author = ret.author.toString();

        if (ret.hasOwnProperty('room') && ret.room) {
          ret.room = ret.room.toString();
        }

        delete ret.visible;
      }
    }
  }
);

messageSchema.add({comments: [messageSchema]});

const Message = mongoose.model<IMessageModel>('Message', messageSchema);
export {Message, IMessageModel};
