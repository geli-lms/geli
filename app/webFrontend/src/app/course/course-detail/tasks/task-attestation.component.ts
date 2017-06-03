import {Component, Input, OnInit} from '@angular/core';
import {TaskAttestationService, TaskService} from '../../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-task-attestation',
  templateUrl: './task-attestation.component.html',
  styleUrls: ['./task-attestation.component.scss']
})
export class TaskAttestationComponent implements OnInit {
  @Input() taskId: any;
  task: any;
  taskOriginal: any;
  tasks: any[] = []; // WORKAROUND with array for {{}}
  ncountOfTaskAttestationsFor: any;

  constructor(private taskService: TaskService,
              private taskAttestationService: TaskAttestationService,
              private userService: UserService,
              private snackBar: MdSnackBar) {  //
  }

  ngOnInit() {
    this.loadTaskFromServer();
    // console.log('taskId:' + this.taskId);
  }

  loadTaskFromServer() {
    this.taskService.readSingleItem(this.taskId).then(task => {
      this.task = task;
      this.taskOriginal = JSON.parse(JSON.stringify(  this.task)); // WORKAROUND
        this.answerPreparationAfterLoadingFromServer(this.task);
      // this.log(this.task);
      this.tasks.push(this.task);
    });
  }

  answerPreparationAfterLoadingFromServer(task: any) {
    for (const answer of task.answers) {
      answer.value = false; // reset answer value
      delete answer._id; // TODO WORKAROUND get rid of the _id for the answers
    }
  }

  saveTaskAsTaskAttestation() {
    // check if answers are correct
    let correctlyAnswered = true;

    for (let i = 0; i < this.task.answers.length; i++) {
      if (this.task.answers[i].value !== this.taskOriginal.answers[i].value) {
        correctlyAnswered = false;
        break;
      };
    }
    // console.log('correctlyAnswered' + correctlyAnswered);
    // save attestation
    const taskId = this.task._id;
    const userId = this.userService.user._id;
    this.taskAttestationService.saveTaskAsTaskAttestation(taskId, userId, this.task, correctlyAnswered).then(
      (val) => {
        // console.log(JSON.stringify(val));
        this.snackBar.open('Task attestation saved', 'Update', {duration: 2000});
      }, (error) => {
        console.log(error);
      });
  }

  countOfTaskAttestationsFor(taskId: string) {
    return this.taskAttestationService.countOfTaskAttestationsFor(taskId).then( (val) => val);
  }

  countOfEnrolledStudentsForCourse(courseId: string) {
    return this.taskAttestationService.countOfEnrolledStudentsForCourse(courseId);

  }

  countOfTaskAttestationCompletedForCourseAndUser(courseId: string, userId: string)  {
    return this.taskAttestationService.countOfTaskAttestationCompletedForCourseAndUser(courseId, userId);

  }

  countOfTaskAttestationCorrectlyCompletedForCourseAndUser(courseId: string, userId: string)  {
    return this.taskAttestationService.countOfTaskAttestationCorrectlyCompletedForCourseAndUser(courseId, userId);

  }

  getTasksAttestationsForCourseAndUser(courseId: string, userId: string)  {
    return this.taskAttestationService.getTasksAttestationsForCourseAndUser(courseId, userId);

  }
}
