import * as mongoose from 'mongoose';
import {IMessage, IMessageDisplay} from '../../../shared/models/messaging/IMessage';
import {IUser} from '../../../shared/models/IUser';
import {extractMongoId} from '../utilities/ExtractMongoId';

interface IMessageModel extends IMessage, mongoose.Document {
  exportJSON: () => Promise<IMessageModel>;
  forDisplay: () => IMessageDisplay;
}

interface IMessageMongoose extends mongoose.Model<IMessageModel> {
  exportPersonalData: (user: IUser) => Promise<IMessage>;
}

let Message: IMessageMongoose;


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

messageSchema.methods.exportJSON = function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties

  return obj;
};

messageSchema.methods.forDisplay = function (): IMessageDisplay {
  const {_id, content, room, chatName, comments, updatedAt, createdAt} = this;
  return {
    _id: <string>extractMongoId(_id),
    content,
    room: <string>extractMongoId(room),
    chatName,
    comments: comments.map((comment: IMessageModel) => comment.forDisplay()),
    updatedAt,
    createdAt,
  };
};

messageSchema.statics.exportPersonalData = async function(user: IUser) {
  return (await Message.find({'author': user._id}).sort({room: 1, createdAt: 1}).select('-comments'))
    .map(messages => messages.exportJSON());
};


Message = mongoose.model<IMessageModel, IMessageMongoose>('Message', messageSchema);

export {Message, IMessageModel};
