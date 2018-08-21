// tslint:disable:no-console

import {Course, ICourseModel} from '../../models/Course';
import {ChatRoom, IChatRoomModel} from '../../models/ChatRoom';


class CourseV2Migration {

  async up() {
    const oldCourses: ICourseModel[] = await Course.find({'chatRooms': {$exists: false}});
    return Promise.all(oldCourses.map(async (course: ICourseModel) => {

      const newChatRoom: IChatRoomModel = await ChatRoom.create({
        name: 'General',
        description: 'This is a general chat for the course ' + course.name,
        room: {
          roomType: 'Course',
          roomFor: course
        }
      });

      course.chatRooms = [newChatRoom];
      course.save();
    }));
  }

}

export = CourseV2Migration;
