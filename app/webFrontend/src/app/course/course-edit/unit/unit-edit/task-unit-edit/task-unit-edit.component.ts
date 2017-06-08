import {Component, Input, OnInit} from '@angular/core';
import {TaskService, UnitService} from '../../../../../shared/services/data.service';
import {Task} from '../../../../../models/Task';
import {MdSnackBar} from '@angular/material';
import {ITaskUnit} from '../../../../../../../../../shared/models/units/ITaskUnit';
import {TaskUnit} from '../../../../../models/TaskUnit';
import {ITask} from '../../../../../../../../../shared/models/task/ITask';
import {Answer} from '../../../../../models/Answer';

@Component({
  selector: 'app-task-unit-edit',
  templateUrl: './task-unit-edit.component.html',
  styleUrls: ['./task-unit-edit.component.scss']
})
export class TaskUnitEditComponent implements OnInit {
  @Input() courseId: any;
  @Input() lectureId: string;
  @Input() model: ITaskUnit;
  tasks: any[];

  constructor(private taskService: TaskService,
              private unitService: UnitService,
              private snackBar: MdSnackBar) {}

  ngOnInit() {
    if(!this.model) {
      this.model = new TaskUnit(this.courseId);
    }

    this.loadTasksFromServer();
  }

  loadTasksFromServer() {
    this.taskService.getTasksForCourse(this.courseId).then(tasks => {
      this.tasks = tasks;

      for (const task of this.tasks) {
        this.answerPreparationAfterLoadingFromServer(task); // WORKAROUND get rid of the _id for the answers
      }
    });
  }

  addUnit() {
    this.unitService.addTaskUnit(this.model, this.lectureId)
      .then(
        (task) => {
          this.snackBar.open('Task created', '', { duration: 3000});
        },
        (error) => {
          console.log(error);
        });
  };

  addTask() {
    this.model.tasks.push(new Task());
    // this.createTask(newTask);
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

  addAnswerAtEnd(task: ITask) {
    task.answers.push(new Answer()); // add item to end
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
