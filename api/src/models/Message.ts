import * as mongoose from 'mongoose';
import {IMessage} from '../../../shared/models/IMessage';


interface IMessageModel extends IMessage, mongoose.Document {
  exportJSON: () => Promise<IMessage>;
}

const messageSchema = new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    content: {
      type: 'string',
      required: true
    },
    visible: {
      type: Boolean,
      default: true,
    },
    refType: String,
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'refType'
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
