import {Component, OnInit, Input} from '@angular/core';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressService} from '../../shared/services/data/progress.service';
import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import {ITaskUnitProgress} from '../../../../../../shared/models/progress/ITaskUnitProgress';
import {TaskUnitProgress} from '../../models/progress/TaskUnitProgress';
import * as moment from 'moment';

const knuth = require('knuth-shuffle').knuthShuffle;

@Component({
  selector: 'app-task-unit',
  templateUrl: './task-unit.component.html',
  styleUrls: ['./task-unit.component.scss']
})
export class TaskUnitComponent implements OnInit {

  @Input() taskUnit: ITaskUnit;

  progress: ITaskUnitProgress;
  validationMode = false;
  deadlineIsOver = false;
  courseId: string;

  constructor(private route: ActivatedRoute,
              private progressService: ProgressService,
              private snackBar: SnackBarService) {
  }

  ngOnInit() {
    if (!this.taskUnit.progressData) {
      this.progress = new TaskUnitProgress(this.taskUnit);
    } else {
      this.progress = this.taskUnit.progressData;
    }

    this.applyProgressData();
    this.shuffleAnswers();
    this.deadlineIsOver = moment(new Date()).isAfter(this.taskUnit.deadline);
  }

  async applyProgressData() {
    const progress = await this.progressService.getUnitProgress<ITaskUnitProgress>(this.taskUnit._id);
    if (progress) {
      this.progress = progress;
    }

    if (!this.progress.answers) {
      this.resetProgressAnswers();
    } else {
      this.taskUnit.tasks.forEach(task => {
        if (!this.progress.answers[task._id]) {
          this.progress.answers[task._id] = {};
          task.answers.forEach(answer => this.progress.answers[task._id][answer._id] = false);
        } else {
          task.answers.forEach(answer => {
            if (!this.progress.answers[task._id][answer._id]) {
              this.progress.answers[task._id][answer._id] = false;
            }
          });
        }
      });
    }
  }

  resetProgressAnswers() {
    this.taskUnit.tasks.forEach(task => {
      // Initialize all as unchecked
      this.progress.answers[task._id] = {};
      task.answers.forEach(answer => this.progress.answers[task._id][answer._id] = false);
    });
  }

  reset() {
    this.resetProgressAnswers();
    this.validationMode = false;
    this.shuffleAnswers();
  }

  validate() {
    this.validationMode = true;

    this.progressService.updateItem(this.progress)
      .then((savedProgress) => {
        this.snackBar.openShort('Progress has been saved');
        this.progress = savedProgress;
      })
      .catch((err) => {
        this.snackBar.openShort(`An error occurred: ${err.error.message}`);
      });
  }

  shuffleAnswers() {
    this.taskUnit.tasks.forEach((task) => {
      knuth(task.answers);
    });
  }
}
