import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {TaskService} from '../../../../shared/services/data.service';
import {ITaskUnit} from '../../../../../../../../shared/models/units/ITaskUnit';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {ITask} from '../../../../../../../../shared/models/ITask';
import {Task} from '../../../../models/Task';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})

export class TaskCardComponent implements OnInit {
  @Input() lecture: ILecture;
  @Input() taskUnit: ITaskUnit;
  @Input() editMode;
  @Output() onRemoveTask = new EventEmitter();
  @Output() onTaskCreated = new EventEmitter<ITask>();
  // @Output() onTaskCancel = new EventEmitter();

  task: ITask;

  constructor(private taskService: TaskService) {
    this.task = new Task();
  }

  ngOnInit() {
    if (this.task) {
      this.editorCancelTask();
    } else {
      this.answerPreparationAfterLoadingFromServer(); // WORKAROUND get rid of the _id for the answers
    }
  }

  answerPreparationAfterLoadingFromServer() {
    for (const answer of this.task.answers) {
      delete answer._id;
    }
  }

  editorCancelTask() {
    if (this.editMode) { // cancel
      this.taskService.readSingleItem(this.task._id).then( // TODO don't use reload from server, use a original copy instead
        (val) => {
          // this.task = val;
          this.answerPreparationAfterLoadingFromServer(); // WORKAROUND get rid of the _id for the answers TODO change

          // this.onTaskCancel.emit();

        }, (error) => {
          console.log(error);
        });
    } else { // edit
    }
    this.editMode = !this.editMode;
  }

  createTask() {
    // this.log(this.task);
    this.taskService.createItem(this.task).then(
      (task) => {
        this.task = task; // get _id
        this.onTaskCreated.emit(this.task);

      }, (error) => {
        console.log(error);
      });
  }

  updateTask() {
    // this.log(this.task);
    this.taskService.updateItem(this.task).then(
      (val) => {
        this.editMode = !this.editMode;

      }, (error) => {
         console.log(error);
      });
  }

  removeTask() {
    this.onRemoveTask.emit(this.task);
  }

  removeAnswer(idx: number) {
    this.task.answers.splice(idx, 1);
  }

  addAnswer() {
    // this.task.answers.splice(0, 0, { value: false,  text: ''}); // add item to start
  }

  isTaskValid(): boolean {
    return this.task.name != null && !(this.task.name.trim() === '');
  }

  // log(val) { console.log(JSON.stringify(val)); }

}
