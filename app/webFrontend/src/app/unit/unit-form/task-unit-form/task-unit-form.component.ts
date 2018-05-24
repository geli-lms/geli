import {Component, OnInit} from '@angular/core';
import {NotificationService, UnitService} from '../../../shared/services/data.service';
import {Task} from '../../../models/Task';
import {ITaskUnit} from '../../../../../../../shared/models/units/ITaskUnit';
import {Answer} from '../../../models/Answer';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';
import {SnackBarService} from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-task-unit-form',
  templateUrl: './task-unit-form.component.html',
  styleUrls: ['./task-unit-form.component.scss']
})
export class TaskUnitFormComponent implements OnInit {
  model: ITaskUnit;

  unitForm: FormGroup;

  constructor(private unitService: UnitService,
              private snackBar: SnackBarService,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private unitFormService: UnitFormService) {}


  ngOnInit() {
    this.unitForm = this.unitFormService.unitForm;

    this.unitFormService.unitInfoText =
      'Add questions with any number of possible answers. Mark the correct answer(s) with the checkbox.\n';
    this.unitFormService.headline = 'Tasks';

    this.model = <ITaskUnit>this.unitFormService.model;

    this.buildForm();

    this.unitFormService.beforeSubmit = async () => {
      return await this.isTaskUnitValid();
    };

  }

  buildForm() {
    // first reset
    this.unitForm.removeControl('tasks');

    // add new control
    this.unitForm.addControl('tasks', this.formBuilder.array([]));


    for (const task of this.model.tasks) {
      this.addTask(task);
    }

    // add new question if the model is empty (typically in case of creating new Tasks)
    if ((<FormArray>this.unitForm.controls.tasks).controls.length === 0) {
      this.addTask();
    }

  }

  isTaskUnitValid() {
    const taskUnit = this.unitForm.value;

    if (!taskUnit.name || taskUnit.name === null || taskUnit.name.trim() === '') {
      const message = 'Task not valid: Name is required';
      this.snackBar.openShort(message);
      return false;
    } else if (taskUnit.tasks.length === 0) {
      const message = 'Task not valid: At least one question is required';
      this.snackBar.openShort(message);
      return false;
    } else {
      // Check if all tasks i.e. questions are valid
      for (const task of taskUnit.tasks) {
        if (task.name === null || task.name.trim() === '') {
          const message = 'Task not valid: Every question requires some text';
          this.snackBar.openShort(message);
          return false;
        } else if (task.answers.length < 2) {
          const message = 'Task not valid: Every question requires at least two answers';
          this.snackBar.openShort(message);
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
              this.snackBar.openShort(message);
              return false;
            }
          }
          if (noAnswersChecked) {
            const message = 'Task not valid: Every question requires at least one checked answer';
            this.snackBar.openShort(message);
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

    // if task exist, set values
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
      text: new FormControl(null, Validators.required)
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
      this.snackBar.openShort(message);
    }
  }

  removeTask(taskControl) {
    let tasks = (<FormArray>this.unitForm.controls.tasks).controls;

    if (tasks.length > 1) {
      if (!taskControl.value._id) {
        tasks = tasks.filter(obj => taskControl.value !== obj.value);
        // search by value
      } else {
        tasks = tasks.filter(obj => taskControl.value._id !== (obj).value._id);
        // search by filter
      }
    } else {
      const message = 'Not possible: At least one question is required';
      this.snackBar.openShort(message);
    }

    // sets changed tasks to original position
    (<FormArray>this.unitForm.controls.tasks).controls = tasks;

  }

  /**
   * Helper function to get tasks from Form for template
   * @returns {FormArray}
   */
  get formTasks() {
    return <FormArray>this.unitForm.get('tasks');
  }


}
