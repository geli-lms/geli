// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {Course, ICourseModel} from '../../models/Course';
import {ChatRoom, IChatRoomModel} from '../../models/ChatRoom';
import {ObjectID} from 'bson';


class CourseV2Migration {

  async up() {
    console.log('Course Chatroom Migration up was called');
    try {
      const oldCourses: ICourseModel[] = await Course.find({$or: [{'chatRooms': { $exists: false}}, {'chatRooms': {$size: 0}} ]});
      await Promise.all(oldCourses.map(async (course: ICourseModel) => {
        const courseObj = course.toObject();
        const newChatRoom: IChatRoomModel = await ChatRoom.create({
          name: 'General',
          description: 'This is a general chat for the course ' + course.name,
          room: {
            roomType: 'Course',
            roomFor: course._id
          }
        });

        courseObj.chatRooms = [newChatRoom];

        courseObj._id = new ObjectID(courseObj._id);

        return await mongoose.connection.collection('courses')
          .findOneAndReplace({'_id': courseObj._id}, courseObj);
      }));
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('Course Chatrooms have been added sucessfully!');
    return true;
  }

}

export = CourseV2Migration;
