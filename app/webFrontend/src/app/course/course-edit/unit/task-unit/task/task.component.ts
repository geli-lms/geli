import {Component, Input, OnInit} from '@angular/core';
import {TaskAttestationService} from '../../../../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {UserService} from '../../../../../shared/services/user.service';
import {ITaskUnitProgress} from '../../../../../../../../../shared/models/ITaskUnitProgress';
import {ProgressService, TaskUnitProgressService} from '../../../../../shared/services/data/progress.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

// Task attestation frame for Task
export class TaskComponent implements OnInit {

  @Input() task: any;
  @Input() taskUnit: any;
  taskOriginal: any;
  tasks: any[] = []; // WORKAROUND with array for {{}}
  progress: ITaskUnitProgress;

  constructor(private taskAttestationService: TaskAttestationService,
              private userService: UserService,
              private progressService: ProgressService,
              private taskUnitProgressService: TaskUnitProgressService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.loadTaskFromServer();
    this.loadProgress();
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
    }
    // save attestation
    const taskId = this.task._id;
    const userId = this.userService.user._id;
    this.taskAttestationService.saveTaskAsTaskAttestation(taskId, userId, this.taskUnit, this.task, correctlyAnswered).then(
      (val) => {
        this.snackBar.open('Task attestation saved', 'Update', {duration: 2000});
      }, (error) => {
        console.log(error);
      }).then(() => {
      this.submitProgress();
    });
  }

  validate(): any {
    return this.taskAttestationService.getTaskAttestationsForTaskUnitAndUser(this.taskUnit._id, this.userService.user._id)
      .then((saved) => {
        let done = true;
        if (saved.length === this.taskUnit.tasks.length) { // are all tasks filled in?
          for (const taskAttestation of saved) {
            if (taskAttestation.correctlyAnswered === false) {
              done = false; // if only one task attestation is wrong, complete progress of taskunit is false
              break;
            }
          }
        } else {
          done = false; // if not all false
        }
        return done;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  submitProgress() {
    this.validate().then((done) => {
      this.progress.done = done;

      if (!this.progress.user || !this.progress.unit) {
        this.progress.course = this.taskUnit._course;
        this.progress.unit = this.taskUnit._id;
        this.progress.user = this.userService.user._id;
        this.taskUnitProgressService.createItem(this.progress)
          .then((saved) => {
            this.progress = saved;
          })
          .catch((error) => console.log(error));
      } else {
        this.taskUnitProgressService.updateItem(this.progress)
          .catch((error) => console.log(error));
      }
    });
  }

  private loadProgress() {
    this.progress = {course: '', unit: '', user: '', done: false};
    const mythis = this;
    this.progressService.getUserProgress(this.userService.user._id)
      .then((progress: any) => {
        for (const prop in progress) {
          if (progress[prop].unit === mythis.taskUnit._id) {
            mythis.progress = progress[prop];
            break;
          }
        }
      }).catch((error) => {
      console.log(error);
    });

  }

}
