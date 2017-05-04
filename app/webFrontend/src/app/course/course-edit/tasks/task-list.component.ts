import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../../shared/data.service';
import {Task} from '../../../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() courseId: any;
  tasks: any[];
  addingTask: boolean = false;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.loadTasksFromServer();
    // console.log('courseid:' + this.courseId);
  }

  loadTasksFromServer() {
    this.taskService.getTasksForCourse(this.courseId).then(tasks => {
      this.tasks = tasks;
    });
  }

  onRemoveTask(task: any) {
    this.taskService.deleteItem(task).then(tasks => {
      this.tasks = this.tasks.concat(this.tasks.filter(obj => task._id !== obj._id));

    });
  }

  onTaskCreated(task: any) {
    this.addingTask = false;
    this.loadTasksFromServer();
  }

  addTask() {
    this.addingTask = true;
    const newTask = new Task(this.courseId, 'Frage hier eingeben.');
    this.tasks.splice(0, 0, newTask); // add item to start
  }

  /*
  onTaskCancel() {
    this.cancelTask();
  }*/

  cancelTask() {
    this.addingTask = false;
    this.loadTasksFromServer();
  }
}
