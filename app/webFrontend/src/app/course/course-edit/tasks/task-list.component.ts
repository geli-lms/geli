import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../../../shared/services/data.service';
import {TaskAttestationService} from '../../../shared/services/data.service';
import {Task} from '../../../models/Task';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() courseId: any;
  tasks: any[];

  constructor(private taskService: TaskService,
              private taskAttestationService: TaskAttestationService,
              private snackBar: MdSnackBar
  ) {
  }

  ngOnInit() {
    this.loadTasksFromServer();
    // console.log('courseid:' + this.courseId);
  }

  loadTasksFromServer() {
    this.taskService.getTasksForCourse(this.courseId).then(tasks => {
      this.tasks = tasks;

      for (const task of this.tasks) {
        this.answerPreparationAfterLoadingFromServer(task); // TODO WORKAROUND get rid of the _id for the answers
      }
    });
  }

  addTask() {
    const newTask = new Task(this.courseId, null);
    this.createTask(newTask);
  }

  //  log(val) { console.log(JSON.stringify(val)); }

  createTask(task: any) {
    // this.log(this.task);
    this.taskService.createItem(task).then(
      (val) => {
        task = val; // get _id
        this.tasks.splice(0, 0, task); // add item to start

   //     this.log(val);
      }, (error) => {
        console.log(error);
      });
  }

  answerPreparationAfterLoadingFromServer(task: any) {
    for (const answer of task.answers) {
      delete answer._id;
    }
  }

  addAnswerAtEnd(task: any) {
    task.answers.push({ value: false,  text: ''}); // add item to end
}

  removeLastAnswer(task: any) {
    task.answers.pop();
  }

  updateTask(task: any) {
    // this.log(this.task);
    this.taskService.updateItem(task).then(
      (val) => {
        this.snackBar.open('Task saved', 'Update', {duration: 2000});

      }, (error) => {
        console.log(error);
      });
  }

  removeTask(task: any) {
    this.taskService.deleteItem(task).then(tasks => {
      this.tasks = (this.tasks.filter(obj => task._id !== obj._id));
      this.snackBar.open('Task deleted', 'Delete', {duration: 2000});

    });
  }
}
