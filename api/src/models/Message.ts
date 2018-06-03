import * as mongoose from 'mongoose';
import {IMessage} from '../../../shared/models/Messaging/IMessage';


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
        ret.room = ret.room.toString();
/*
        if (ret.hasOwnProperty('comments') && ret.comments) {
           ret.comments.forEach((comment: any) => {
             comment.toString();
           });
          ret.parent = ret.parent.toString();
        }*/
      }
    }
  }
);

messageSchema.add({comments: [messageSchema]});


const Message = mongoose.model<IMessageModel>('Message', messageSchema);
export {Message, IMessageModel};
