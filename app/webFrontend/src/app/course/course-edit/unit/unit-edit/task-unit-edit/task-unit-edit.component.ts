import {Component, Input, OnInit} from '@angular/core';
import {TaskAttestationService, UnitService} from '../../../../../shared/services/data.service';
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

  constructor(private unitService: UnitService,
              private snackBar: MdSnackBar) {
  }

  /**
   * If model is not given create a new one.
   */
  ngOnInit() {
    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
    }
    for (const task of this.model.tasks) {
      this.answerPreparationAfterLoadingFromServer(task); // WORKAROUND get rid of the _id for the answers
    }
  }

  /**
   * Save data. Decide if change existing task or create new one is needed
   */
  protected onSave() {
    if (this.model._id !== undefined) {
      this.updateTaskUnit();
    } else {
      this.addTaskUnit();
    }
  };

  private addTaskUnit() {
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

  private updateTaskUnit() {
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

  /**
   * Add new task to the array of task in a task unit
   */
  private addTask() {
    this.model.tasks.push(new Task());
  }

  private answerPreparationAfterLoadingFromServer(task: any) {
    for (const answer of task.answers) {
      delete answer._id;
    }
  }

  /**
   * Add new answer to the array of answers in a task
   */
  private addAnswerAtEnd(task: ITask) {
    // create new array
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

  /**
   * Remove last answer from the array of answers in a task
   */
  private removeLastAnswer(task: any) {
    task.answers.pop();
  }

  /**
   * Remove task from the array of task in a task unit
   */
  private removeTask(task: any) {
      this.model.tasks = (this.model.tasks.filter(obj => task._id !== obj._id));
  }
}
