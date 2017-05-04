import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {TaskService} from '../../../shared/data.service';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})

export class TaskCardComponent implements OnInit {
  @Input() task: any;
  @Output() onRemoveTask = new EventEmitter();
  @Output() onTaskCreated = new EventEmitter();
  // @Output() onTaskCancel = new EventEmitter();

  onEdit: boolean = false;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    if (this.task._id === null) {
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
    if (this.onEdit) { // cancel
      this.taskService.readSingleItem(this.task._id).then( // TODO don't use reload from server, use a original copy instead
        (val) => {
          this.task = val;
          this.answerPreparationAfterLoadingFromServer(); // WORKAROUND get rid of the _id for the answers TODO change

          // this.onTaskCancel.emit();

        }, (error) => {
          console.log(error);
        });
    } else { // edit
    }
    this.onEdit = !this.onEdit;
  }

  createTask() {
    // this.log(this.task);
    this.taskService.createItem(this.task).then(
      (val) => {
        this.task = val; // get _id
        this.onEdit = false;
        this.onTaskCreated.emit(val);

      }, (error) => {
        console.log(error);
      });
  }

  updateTask() {
    // this.log(this.task);
    this.taskService.updateItem(this.task).then(
      (val) => {
        this.onEdit = !this.onEdit;

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
    this.task.answers.splice(0, 0, { value: false,  text: 'Antwort hier eingeben.'}); // add item to start
  }

  isTaskValid(): boolean {
    return this.task.name != null && !(this.task.name.trim() === '');
  }

  // log(val) { console.log(JSON.stringify(val)); }

}
