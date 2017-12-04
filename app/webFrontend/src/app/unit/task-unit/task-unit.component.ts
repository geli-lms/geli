import {Component, OnInit, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {ProgressService} from '../../shared/services/data/progress.service';
import {IProgress} from '../../../../../../shared/models/IProgress';
const knuth = require('knuth-shuffle').knuthShuffle;

@Component({
  selector: 'app-task-unit',
  templateUrl: './task-unit.component.html',
  styleUrls: ['./task-unit.component.scss']
})
export class TaskUnitComponent implements OnInit {

  @Input() taskUnit: any;

  progress: IProgress;
  validationMode = false;
  courseId: string;

  constructor(private route: ActivatedRoute,
              private progressService: ProgressService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.courseId = decodeURIComponent(params['id']);
      });

    this.progressService.getUnitProgress(this.taskUnit._id).then((value) => {
      if (value && value.length > 0) {
        this.progress = (<IProgress>value[0]);
      }
    });
    this.shuffleAnswers();
  }

  reset() {
    this.taskUnit.tasks.forEach((task) => {
      task.answers.forEach((answer) => {
        answer.userAnswer = null;
      });
    });
    this.validationMode = false;
    this.shuffleAnswers();
  }

  isAnswerCorrect(answer) {
    return ((typeof answer.value === 'undefined' || !answer.value) && !answer.userAnswer) || (answer.value && answer.userAnswer);
  }

  validate() {
    this.validationMode = true;

    let done = true;

    this.taskUnit.tasks.forEach((task) => {
      task.answers.forEach((answer) => {
        // One wrong answer will mark the TaskUnit as failed
        if (!this.isAnswerCorrect(answer)) {
          done = false;
        }
      });
    });

    if (!this.progress && done) {
      const progress = {
        unit: this.taskUnit._id,
        course: this.courseId,
        done
      };

      this.progressService.createItem(progress)
      .then((savedProgress) => {
        this.progress = savedProgress;
        this.snackBar.open('Progress has been saved', '', {duration: 3000});
      })
      .catch((err) => {
        this.snackBar.open(`An error occurred: ${err.json().message}`, '', {duration: 3000})
      });
    }
  }

  shuffleAnswers() {
    this.taskUnit.tasks.forEach((task) => {
      knuth(task.answers);
    });
  }
}
