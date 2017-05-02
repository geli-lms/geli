import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {TaskService} from '../../../shared/data.service';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
// Add task CRUD (for questions only without answers)
export class TaskCardComponent implements OnInit {
  @Input() task: any;
  @Output() onRemoveTask = new EventEmitter();
  @Output() onTaskCreated = new EventEmitter();

  edittedTask: any;
  onEdit: boolean = false;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.edittedTask = this.task;
    if (this.task._id === null) {
      this.editTask();
    }
  }

  editTask() {
    this.onEdit = !this.onEdit;
    this.edittedTask = this.task;
  }

  createTask() {
    this.taskService.createItem(this.edittedTask).then(
      (val) => {
        this.task = val;
        this.edittedTask = val;
        this.onEdit = false;
        this.onTaskCreated.emit(val);

      }, (error) => {
        console.log(error);
      });
  }

  updateTask() {
    this.taskService.updateItem(this.edittedTask).then(
      (val) => {
        this.task = this.edittedTask;
        this.onEdit = !this.onEdit;

      }, (error) => {
         console.log(error);
      });
  }

  removeTask() {
    this.onRemoveTask.emit(this.task);
  }

  isTaskValid(): boolean {
    return !(this.edittedTask.name.trim() === '')
      ;
  }

}
