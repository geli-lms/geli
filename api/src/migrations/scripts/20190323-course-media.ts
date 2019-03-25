// tslint:disable:no-console
import {Course, ICourseModel} from '../../models/Course';
import {Directory, IDirectoryModel} from '../../models/mediaManager/Directory';
import {File} from '../../models/mediaManager/File';
import {extractSingleMongoId} from '../../utilities/ExtractMongoId';

async function propagateMediaCourse (directory: IDirectoryModel, course: ICourseModel) {
  for (const fileId of directory.files) {
    const file = await File.findById(fileId);
    file._course = course;
    await file.save();
  }

  for (const subDirectoryId of directory.subDirectories) {
    const subDirectory = await Directory.findById(subDirectoryId);
    await propagateMediaCourse(subDirectory, course);
  }

  // Fix the own _course property at the end, so that the migration won't be disabled in case of an error during propagation.
  // (If this were set first, the top-level course directory would be fixed first, whereby the migration won't be
  // triggered on a subsequent run, yet the propagation could technically still fail for subdirectories / files.)
  directory._course = course;
  await directory.save();
}

class CourseMediaMigration {

  async up() {
    console.log('CourseMediaMigration: up was called');
    try {
      const courses = await Course.find();
      await Promise.all(courses.map(async (course: ICourseModel) => {
        const courseMsg = '"' + course.name + '" (' + extractSingleMongoId(course._id) + ')';
        const directory = await Directory.findById(course.media);
        if (directory && (extractSingleMongoId(directory._course) !== extractSingleMongoId(course._id))) {
          console.log('CourseMediaMigration: Fixing media _course property for course ' + courseMsg + ' ...');
          await propagateMediaCourse(directory, course);
          console.log('CourseMediaMigration: Successfully fixed media _course property for course ' + courseMsg + '!');
        } else {
          console.log('CourseMediaMigration: Course ' + courseMsg + ' doesn\'t require fixing.');
        }
      }));
    } catch (error) {
      console.log('CourseMediaMigration: ' + error);
    }
    return true;
  }
}

export = CourseMediaMigration;
