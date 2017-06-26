import {Component, Input, OnInit} from '@angular/core';
import {TaskAttestationService} from '../../../../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {UserService} from '../../../../../shared/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

// Task attestation frame for Task
export class TaskComponent implements OnInit {

  @Input() task: any;

  taskOriginal: any;
  tasks: any[] = []; // WORKAROUND with array for {{}}
  ncountOfTaskAttestationsFor: any;

  constructor(private taskAttestationService: TaskAttestationService,
              private userService: UserService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.loadTaskFromServer();
  }

  /**
   * Prepare task attestation by populate with any existing attestation
   */
  private loadTaskFromServer() {
    this.taskOriginal = JSON.parse(JSON.stringify(this.task)); // WORKAROUND deep copy object
    this.answerPreparationAfterLoadingFromServer(this.task);
    this.tasks.push(this.task);

    // load existing task attestion for this task
    this.taskAttestationService.getTaskAttestationsForTask(this.task._id)
      .then(
        (taskAttestations) => {
          const userId = this.userService.user._id;
          const task = this.task;
          taskAttestations = (taskAttestations.filter(obj => userId === obj.userId));

          for (const taskAttestation of taskAttestations) {
              let i = 0;
              for (const answer of taskAttestation.answers) {
                if (i < task.answers.length) {
                  task.answers[i++].value = answer.value; // set answer value of already saved task attestation
                }
              }
              break;
          }
        },
        (error) => {
          console.log(error);
        });
  }

  private answerPreparationAfterLoadingFromServer(task: any) {
    for (const answer of task.answers) {
      answer.value = false; // reset answer value
      delete answer._id; // WORKAROUND get rid of the _id for the answers
    }
  }

  /**
   * Save attestation of task. One attestation by one user for one task allowed only.
   * Existing will be overwritten.
   */
  private saveTaskAsTaskAttestation() {
    // check if answers are correct
    let correctlyAnswered = true;

    for (let i = 0; i < this.task.answers.length; i++) {
      if (this.task.answers[i].value !== this.taskOriginal.answers[i].value) {
        correctlyAnswered = false;
        break;
      }
      ;
    }
    // save attestation
    const taskId = this.task._id;
    const userId = this.userService.user._id;
    this.taskAttestationService.saveTaskAsTaskAttestation(taskId, userId, this.task, correctlyAnswered).then(
      (val) => {
         this.snackBar.open('Task attestation saved', 'Update', {duration: 2000});
      }, (error) => {
        console.log(error);
      });
  }
/*
  countOfTaskAttestationsFor(taskId: string) {
    return this.taskAttestationService.countOfTaskAttestationsFor(taskId).then((val) => val);
  }

  countOfEnrolledStudentsForCourse(courseId: string) {
    return this.taskAttestationService.countOfEnrolledStudentsForCourse(courseId);

  }

  countOfTaskAttestationCompletedForCourseAndUser(courseId: string, userId: string) {
    return this.taskAttestationService.countOfTaskAttestationCompletedForCourseAndUser(courseId, userId);

  }

  countOfTaskAttestationCorrectlyCompletedForCourseAndUser(courseId: string, userId: string) {
    return this.taskAttestationService.countOfTaskAttestationCorrectlyCompletedForCourseAndUser(courseId, userId);

  }

  getTasksAttestationsForCourseAndUser(courseId: string, userId: string) {
    return this.taskAttestationService.getTasksAttestationsForCourseAndUser(courseId, userId);

  }*/
}
