import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Lecture} from '../../models/Lecture';

@Component({
  selector: 'app-lecture-form',
  templateUrl: './lecture-form.component.html',
  styleUrls: ['./lecture-form.component.scss']
})
export class LectureFormComponent implements OnInit {

  @Input()
  public model: ILecture;

  @Input()
  public actionLabel: string;

  @Input() onCancel: () => void;

  @Output()
  onSubmit = new EventEmitter<ILecture>();

  lectureForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.lectureForm = this.formBuilder.group({
      name: [this.model ? this.model.name : '', Validators.required],
      description: [this.model ? this.model.description : '', Validators.required]
    });
  }

  formSubmit() {
    if (!this.model) {
      this.model = new Lecture();
    }

    this.model.name = this.lectureForm.value.name;
    this.model.description = this.lectureForm.value.description;

    this.onSubmit.emit(this.model);
  }
}
