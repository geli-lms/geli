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

  getTasks() {
    this.taskService.getTasksForCourse(this.courseId).then(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnInit() {
    this.getTasks();
    // console.log('courseid:' + this.courseId);
  }

  onRemoveTask(task: any) {
    this.taskService.deleteItem(task).then(tasks => {
      this.tasks = this.taskService.items;
      // this.getTasks();
    });
  }

  onTaskCreated(task: any) {
    this.addingTask = false;
    this.getTasks();
  }

  addTask() {
    this.addingTask = true;
    const newTask = new Task('Frage hier eingeben.', this.courseId);
    this.taskService.items.splice(0, 0, newTask); // add item to start
  }

  cancelAddTask() {
    this.addingTask = false;
    this.getTasks();
  }
}
