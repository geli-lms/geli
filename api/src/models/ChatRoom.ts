import * as mongoose from 'mongoose';
import {IChatRoom} from '../../../shared/models/IChatRoom';
import {IUser} from '../../../shared/models/IUser';
import {IFlags} from '../../../shared/models/IFlags';
import {User} from './User';
import {Course, ICourseModel} from './Course';
import {Unit} from './units/Unit';

interface IChatRoomModel extends IChatRoom, mongoose.Document {
  checkPrivileges: (user: IUser) => Promise<IFlags>;
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

chatRoomSchema.methods.checkPrivileges = async function (user: IUser) {
  const {userIsAdmin} = User.checkPrivileges(user);

  let userCanAccessRoom = userIsAdmin;
  if (!userCanAccessRoom) {
    const {roomType, roomFor} = this.room;
    let course: ICourseModel;
    switch (roomType) {
      case 'Course':
        course = await Course.findById(roomFor);
        break;
      case 'Unit':
        const unit = await Unit.findById(roomFor).populate('_course');
        course = unit && unit._course;
        break;
    }
    userCanAccessRoom = course && course.checkPrivileges(user).userCanViewCourse;
  }

  return {
    // Currently there is no differentiation between viewing and posting authentication:
    userCanViewMessages: userCanAccessRoom,
    userCanPostMessages: userCanAccessRoom
  };
};

const ChatRoom = mongoose.model<IChatRoomModel>('ChatRoom', chatRoomSchema);
export {ChatRoom, IChatRoomModel};
