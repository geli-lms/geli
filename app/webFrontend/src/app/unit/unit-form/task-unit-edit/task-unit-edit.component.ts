import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NotificationService, UnitService} from '../../../shared/services/data.service';
import {Task} from '../../../models/Task';
import {MatSnackBar} from '@angular/material';
import {ITaskUnit} from '../../../../../../../shared/models/units/ITaskUnit';
import {TaskUnit} from '../../../models/units/TaskUnit';
import {ITask} from '../../../../../../../shared/models/task/ITask';
import {Answer} from '../../../models/Answer';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

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

  @Input() unitForm: FormGroup;


  add = false;

  @ViewChild(UnitGeneralInfoFormComponent)
  private generalInfo: UnitGeneralInfoFormComponent;

  constructor(private unitService: UnitService,
              private snackBar: MatSnackBar,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new TaskUnit(this.course._id);
      this.add = true;
      this.addTask();
    } else {
      this.reloadTaskUnit();
    }


    this.unitForm.addControl('tasks', this.formBuilder.array([]));
    this.buildForm();

    this.unitForm.valueChanges.subscribe(data => {
      console.log(data)
      this.isTaskUnitValid();
    })


  }

  buildForm() {
    for(const task of this.model.tasks){
      const taskControl = this.addTask(task);
    }
  }

  async reloadTaskUnit() {
    // Reload task unit from database to make sure that tasks (and answers)
    // are populated properly (e.g. necessary after a Cancel)
    this.model = <TaskUnit><any>await this.unitService.readSingleItem(this.model._id);
  }

  saveUnit() {

    /* TODO: SAVE */
    this.model = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
      deadline: this.generalInfo.form.value.deadline,
      visible: this.generalInfo.form.value.visible
    };

    if (this.isTaskUnitValid()) {
      let taskPromise = null;
      let text: string;
      if (this.add) {
        taskPromise = this.unitService.createItem({model: this.model, lectureId: this.lectureId});
        text = 'Course ' + this.course.name + ' has a new task unit.';
      } else {
        taskPromise = this.unitService.updateItem(this.model);
        text = 'Course ' + this.course.name + ' has an updated task unit.';
      }
      taskPromise.then(
        (task) => {
          const message = `Task ${this.add ? 'created' : 'updated'}`;
          this.snackBar.open(message, '', {duration: 3000});
          this.onDone();
          return this.notificationService.createItem(
            {
              changedCourse: this.course,
              changedLecture: this.lectureId,
              changedUnit: task,
              text: text
            });
        },
        (error) => {
          const message = `Couldn\'t ${this.add ? 'create' : 'update'} task`;
          this.snackBar.open(message, '', {duration: 3000});
        });
    }
  }

  isTaskUnitValid() {
    const taskUnit = this.unitForm.value;

    if (taskUnit.name === null || taskUnit.name.trim() === '') {
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
        if (task.name === undefined || task.name.trim() === '') {
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
            if (answer.text === undefined || answer.text.trim() === '') {
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
      name: new FormControl(),
      answers: new FormArray([])
    });

    if(task){
      taskControl.patchValue({
        ...task
      })

      for(const answer of task.answers) {
        this.addAnswerAtEnd(taskControl, answer);
      }
    }else{
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

    if(answer){
      answerControl.patchValue({
        ...answer
      })
    }

    (<FormArray>taskControl.controls['answers']).push(answerControl)
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
