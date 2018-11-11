import * as mongoose from 'mongoose';
import {IChatRoom} from '../../../shared/models/IChatRoom';

interface IChatRoomModel extends IChatRoom, mongoose.Document {
}

const chatRoomSchema = new mongoose.Schema({
    name: {
      type: String
    },
    description: {
      type: String
    },
     room: {
      roomType: String,
      roomFor: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'room.roomType',
      }
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
        delete ret.room;
      }
    }
  }
);


const ChatRoom = mongoose.model<IChatRoomModel>('ChatRoom', chatRoomSchema);
export {ChatRoom, IChatRoomModel};
