import {Component, Input, OnInit} from '@angular/core';
import {TaskService, UnitService} from '../../../../shared/services/data.service';
import {Task} from '../../../../models/Task';
import {ITaskUnit} from '../../../../../../../../shared/models/units/ITaskUnit';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {TaskUnit} from '../../../../models/TaskUnit';
import {ITask} from '../../../../../../../../shared/models/ITask';

@Component({
  selector: 'app-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() courseId: any;
  @Input() lecture: ILecture;
  taskUnit: ITaskUnit;
  tasks: any[];
  editMode = false;

  constructor(private taskService: TaskService,
              private unitService: UnitService) {
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
      this.tasks = (this.tasks.filter(obj => task._id !== obj._id));

    });
  }

  onTaskCreated(task: ITask) {
    this.taskUnit.tasks.push(task);
    this.loadTasksFromServer();
  }

  addTask() {
    this.editMode = true;
    if (typeof this.taskUnit === 'undefined') {
      this.taskUnit = new TaskUnit();
    }
    // const newTask = new Task(this.courseId, null);
    // this.tasks.splice(0, 0, newTask); // add item to start
  }

  /*
  onTaskCancel() {
    this.cancelTask();
  }*/

  cancelTask() {
    this.editMode = false;
    this.loadTasksFromServer();
  }
}
