import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TaskService, UnitService} from '../../../shared/services/data.service';
import {Task} from '../../../models/Task';
import {MatSnackBar} from '@angular/material';
import {ITaskUnit} from '../../../../../../../shared/models/units/ITaskUnit';
import {TaskUnit} from '../../../models/TaskUnit';
import {ITask} from '../../../../../../../shared/models/task/ITask';
import {Answer} from '../../../models/Answer';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';

@Component({
  selector: 'app-task-unit-edit',
  templateUrl: './task-unit-edit.component.html',
  styleUrls: ['./task-unit-edit.component.scss']
})
export class TaskUnitEditComponent implements OnInit {
  @Input()
  course: ICourse;

  @Input()
  lectureId: string;

  @Input()
  model: ITaskUnit;

  @Input()
  onDone: () => void;

  @Input()
  onCancel: () => void;

  add = false;

  @ViewChild(UnitGeneralInfoFormComponent)
  private generalInfo: UnitGeneralInfoFormComponent;

  constructor(private taskService: TaskService,
              private unitService: UnitService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
      this.add = true;
    }
  }

  saveUnit() {
    const taskToSend = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
      deadline: this.generalInfo.form.value.deadline,
    };
    let taskPromise = null;
    if (this.add) {
      taskPromise = this.unitService.addTaskUnit(taskToSend, this.lectureId)
    } else {
      taskPromise = this.unitService.updateTaskUnit(taskToSend);
    }
    taskPromise.then(
      (task) => {
        this.snackBar.open(`Task ${this.add ? 'created' : 'updated'}`, '', {duration: 3000});
        this.onDone();
      },
      (error) => {
        console.log(error);
      });
  };

  addTask() {
    this.model.tasks.push(new Task());
  }

  addAnswerAtEnd(task: ITask) {
    task.answers.push(new Answer()); // add item to end
  }

  removeLastAnswer(task: any) {
    task.answers.pop();
  }

  updateTask(task: any) {
    this.taskService.updateItem(task).then(
      (val) => {
        this.snackBar.open('Task saved', 'Update', {duration: 2000});
      }, (error) => {
        console.log(error);
      });
  }

  removeTask(task: any) {
    this.taskService.deleteItem(task).then(tasks => {
      this.model.tasks = this.model.tasks.filter(obj => task._id !== obj._id);
      this.snackBar.open('Task deleted', 'Delete', {duration: 2000});
    });
  }
}
