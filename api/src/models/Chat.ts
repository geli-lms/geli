import * as mongoose from 'mongoose';
import {IChat} from '../../../shared/models/IChat';

interface IChatModel extends IChat, mongoose.Document {
  exportJSON: () => Promise<IChat>;
}

const chatSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    anonymous: {
      type: Boolean,
      default: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
      }
    ],
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course',
      required: true
    },
    rooms: [String]
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

const Chat = mongoose.model<IChatModel>('Chat', chatSchema);

export {Chat, IChatModel};
