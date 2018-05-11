import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {NotificationService, UnitService} from '../../../shared/services/data.service';
import {Task} from '../../../models/Task';
import {MatSnackBar} from '@angular/material';
import {ITaskUnit} from '../../../../../../../shared/models/units/ITaskUnit';
import {TaskUnit} from '../../../models/units/TaskUnit';
import {ITask} from '../../../../../../../shared/models/task/ITask';
import {Answer} from '../../../models/Answer';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';

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


  unitForm: FormGroup;
  add = false;

  constructor(private unitService: UnitService,
              private snackBar: MatSnackBar,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private unitFormService: UnitFormService) {}


  ngOnInit() {

    this.unitForm = this.unitFormService.unitForm;


    this.unitFormService.headline = 'Tasks';
    this.unitFormService.unitDescription =
      'Add questions with any number of possible answers. Mark the correct answer(s) with the checkbox.';


    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
      this.add = true;
      this.addTask();
    } else {
      this.reloadTaskUnit();
    }

    this.buildForm();

    // tslint:disable-next-line:no-console
    console.log(this.model);

    this.unitFormService.beforeSubmit = async () => {
      return await this.isTaskUnitValid();
    };

    this.unitFormService.submitDone.subscribe(() => {
      this.onDone();
    });

  }

  buildForm() {
    // first reset
    this.unitForm.removeControl('tasks');

    // add new control
    this.unitForm.addControl('tasks', this.formBuilder.array([]));


    for (const task of this.model.tasks) {
      const taskControl = this.addTask(task);
    }
  }

  async reloadTaskUnit() {
    // Reload task unit from database to make sure that tasks (and answers)
    // are populated properly (e.g. necessary after a Cancel)
    this.model = <TaskUnit><any>await this.unitService.readSingleItem(this.model._id);
  }


  isTaskUnitValid() {
    const taskUnit = this.unitForm.value;
    // tslint:disable-next-line:no-console
    console.log(taskUnit);
    if (!taskUnit.name || taskUnit.name === null || taskUnit.name.trim() === '') {
      const message = 'Task not valid: Name is required';
      this.snackBar.open(message, '', {duration: 3000});
      return false;
    } else if (taskUnit.tasks.length === 0) {
      const message = 'Task not valid: At least one question is required';
      this.snackBar.open(message, '', {duration: 3000});
      return false;
    } else {
      // Check if all tasks i.e. questions are valid
      for (const task of taskUnit.tasks) {
        if (task.name === null || task.name.trim() === '') {
          const message = 'Task not valid: Every question requires some text';
          this.snackBar.open(message, '', {duration: 3000});
          return false;
        } else if (task.answers.length < 2) {
          const message = 'Task not valid: Every question requires at least two answers';
          this.snackBar.open(message, '', {duration: 3000});
          return false;
        } else {
          // Check if answers are valid
          let noAnswersChecked = true;

          for (const answer of task.answers) {
            if (noAnswersChecked) {
              noAnswersChecked = !answer.value;
            }
            if (answer.text === null || answer.text.trim() === '') {
              const message = 'Task not valid: Every answer requires some text';
              this.snackBar.open(message, '', {duration: 3000});
              return false;
            }
          }
          if (noAnswersChecked) {
            const message = 'Task not valid: Every question requires at least one checked answer';
            this.snackBar.open(message, '', {duration: 3000});
            return false;
          }
        }
      }
    }
    return true;
  }

  addTask(task?: Task) {
    const taskControl = this.formBuilder.group({
      _id: new FormControl(),
      name: new FormControl(null, Validators.required),
      answers: new FormArray([])
    });

    if (task) {
      taskControl.patchValue({
        ...task
      });

      for (const answer of task.answers) {
        this.addAnswerAtEnd(taskControl, answer);
      }
    } else {
      taskControl.removeControl('_id');
      this.addAnswerAtEnd(taskControl);
      this.addAnswerAtEnd(taskControl);
    }


    (<FormArray>this.unitForm.controls['tasks']).push(taskControl);
    return taskControl;
  }

  addAnswerAtEnd(taskControl, answer?: Answer) {
    const answerControl = this.formBuilder.group({
      _id: new FormControl(),
      value: new FormControl(),
      text: new FormControl()
    });

    if (answer) {
      answerControl.patchValue({
        ...answer
      });
    } else {
      answerControl.removeControl('_id');
    }

    (<FormArray>taskControl.controls['answers']).push(answerControl);
  }

  removeAnswer(taskControl, index: number) {
    if (taskControl.controls.answers.controls.length > 2) {
      if (index > -1) {
        taskControl.controls.answers.controls.splice(index, 1);
      }
    } else {
      const message = 'Not possible: Every question requires at least two answers';
      this.snackBar.open(message, '', {duration: 3000});
    }
  }

  removeTask(taskControl) {
    let tasks = (<FormArray>this.unitForm.controls.tasks).controls;

    if (tasks.length > 1) {
      if (!taskControl.value._id) {
        tasks = tasks.filter(obj => taskControl.value !== obj.value);
      } else {
        tasks = tasks.filter(obj => taskControl.value._id !== (obj).value._id);
      }
    } else {
      const message = 'Not possible: At least one question is required';
      this.snackBar.open(message, '', {duration: 3000});
    }

    (<FormArray>this.unitForm.controls.tasks).controls = tasks;

  }
}
