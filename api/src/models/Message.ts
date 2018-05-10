import * as mongoose from 'mongoose';
import {IMessage} from '../../../shared/models/IMessage';



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
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    }
  }
);


const Message = mongoose.model<IMessageModel>('Message', messageSchema);
export {Message, IMessageModel};
