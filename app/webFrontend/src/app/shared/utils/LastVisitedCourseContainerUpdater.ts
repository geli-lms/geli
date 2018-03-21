import {UserService} from '../services/user.service';
import {UserDataService} from '../services/data.service';

export class LastVisitedCourseContainerUpdater {
  public static addCourseToLastVisitedCourses(
    courseId: string,
    userService: UserService,
    userDataService: UserDataService
  ) {
    const user = userService.user;
    user.lastVisitedCourses = user.lastVisitedCourses.filter(id => id !== courseId);
    user.lastVisitedCourses.unshift(courseId);
    userDataService.updateItem(user)
      .then((updatedUser) => {
        userService.setUser(updatedUser);
      });
  }
}
