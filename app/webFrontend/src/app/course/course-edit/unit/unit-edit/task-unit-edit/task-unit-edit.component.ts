import {Component, Input, OnInit} from '@angular/core';
import {TaskAttestationService, TaskService, UnitService} from '../../../../../shared/services/data.service';
import {Task} from '../../../../../models/Task';
import {MdSnackBar} from '@angular/material';
import {ITaskUnit} from '../../../../../../../../../shared/models/units/ITaskUnit';
import {TaskUnit} from '../../../../../models/TaskUnit';
import {ITask} from '../../../../../../../../../shared/models/task/ITask';
import {ICourse} from '../../../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-task-unit-edit',
  templateUrl: './task-unit-edit.component.html',
  styleUrls: ['./task-unit-edit.component.scss']
})

export class TaskUnitEditComponent implements OnInit {
  @Input() course: ICourse;
  @Input() lectureId: string;
  @Input() model: ITaskUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;
  tasks: any[];

  constructor(private taskService: TaskService,
              private taskAttestationService: TaskAttestationService,
              private unitService: UnitService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
    }
    for (const task of this.model.tasks) {
      this.answerPreparationAfterLoadingFromServer(task); // TODO WORKAROUND get rid of the _id for the answers
    }
    this.model = this.model;
  }

  onSave() {
    if (this.model._id !== undefined) {
      this.updateTaskUnit();
    } else {
      this.addTaskUnit();
    }
  };

  addTaskUnit() {
    this.unitService.addTaskUnit(this.model, this.lectureId)
      .then(
        (task) => {
          this.snackBar.open('Task(s) saved', '', {duration: 3000});
          this.onDone();
        },
        (error) => {
          console.log(error);
        });
  };

  updateTaskUnit() {
    this.unitService.updateTaskUnit(this.model)
      .then(
        (task) => {
          this.snackBar.open('Task(s) saved', '', {duration: 3000});
          this.onDone();
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
/*
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
*/
  answerPreparationAfterLoadingFromServer(task: any) {
    for (const answer of task.answers) {
      delete answer._id;
    }
  }

  addAnswerAtEnd(task: ITask) {
    if (task.answers === undefined) {
      task.answers = [{_id: undefined, value: false, text: ''}];
    } else {
      task.answers.push({
        _id: undefined,
        value: false,
        text: ''
      }); // add item to end
    }
  }

  removeLastAnswer(task: any) {
    task.answers.pop();
  }
/*
  updateTask(task: any) {
    // this.log(this.task);
    this.taskService.updateItem(task).then(
      (val) => {
        this.snackBar.open('Task saved', 'Update', {duration: 2000});

      }, (error) => {
        console.log(error);
      });
  }
*/
  removeTask(task: any) {
      this.model.tasks = (this.model.tasks.filter(obj => task._id !== obj._id));
  }
}
