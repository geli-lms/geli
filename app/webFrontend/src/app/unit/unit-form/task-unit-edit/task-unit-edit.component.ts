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

  tasks: any[];

  constructor(private taskService: TaskService,
              private unitService: UnitService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
      this.add = true;
    }

    this.loadTasksFromServer();
  }

  loadTasksFromServer() {
    this.taskService.getTasksForCourse(this.course._id).then(tasks => {
      this.tasks = tasks;

      for (const task of this.tasks) {
        this.answerPreparationAfterLoadingFromServer(task); // WORKAROUND get rid of the _id for the answers
      }
    });
  }

  saveUnit() {
    this.model = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
      deadline: this.generalInfo.form.value.deadline,
    };

    if (this.isTaskUnitValid()) {
      let taskPromise = null;
      if (this.add) {
        taskPromise = this.unitService.addTaskUnit(this.model, this.lectureId)
      } else {
        taskPromise = this.unitService.updateItem(this.model);
      }
      taskPromise.then(
        (task) => {
          this.snackBar.open(`Task ${this.add ? 'created' : 'updated'}`, '', {duration: 3000});
          this.onDone();
        },
        (error) => {
          console.log(error);
        });
    }
  };

  isTaskUnitValid() {
    const taskUnit = this.model;

    if (taskUnit.name === null || taskUnit.name.trim() === '') {
      this.snackBar.open('Task not valid: Name is required', '', {duration: 3000});
      return false
    } else if (taskUnit.tasks.length === 0) {
      this.snackBar.open('Task not valid: At least one question is required', '', {duration: 3000});
      return false
    } else {
      for (const task of taskUnit.tasks) {
        if (task.name === undefined || task.name.trim() === '') {
          this.snackBar.open('Task not valid: Every question requires some text', '', {duration: 3000});
          return false
        } else if (task.answers.length < 2) {
          this.snackBar.open('Task not valid: Every question requires at least two answers', '', {duration: 3000});
          return false
        } else {
          let noAnswersChecked = true;

          for (const answer of task.answers) {
            if (noAnswersChecked) {
              noAnswersChecked = !answer.value
            }
            if (answer.text === undefined || answer.text.trim() === '') {
              this.snackBar.open('Task not valid: Every answer requires some text', '', {duration: 3000});
              return false
            }
          }
          if (noAnswersChecked) {
            this.snackBar.open('Task not valid: Every question requires at least one checked answer', '', {duration: 3000});
            return false
          }
        }
      }
    }
    return true
  }

  addTask() {
    this.model.tasks.push(new Task());
    // this.createTask(newTask);
  }

  createTask(task: any) {
    // this.log(this.task);
    this.taskService.createItem(task).then(
      (val) => {
        task = val; // get _id
        this.tasks.splice(0, 0, task); // add item to start

        //     this.log(val);
      }, (error) => {
        // FIXME: Add snackbar here
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
        // FIXME: Add snackbar here
      });
  }

  removeTask(task: any) {
    this.taskService.deleteItem(task).then(tasks => {
      this.tasks = (this.tasks.filter(obj => task._id !== obj._id));
      this.snackBar.open('Task deleted', 'Delete', {duration: 2000});

    });
  }
}
