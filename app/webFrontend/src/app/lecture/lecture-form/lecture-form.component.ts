import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataSharingService} from '../../shared/services/data-sharing.service';
import {Lecture} from '../../models/Lecture';
import {DialogService} from '../../shared/services/dialog.service';
import {MatSnackBar} from '@angular/material';

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
  @Output()
  onImport = new EventEmitter();

  lectureForm: FormGroup;

  constructor(
  private formBuilder: FormBuilder,
              private dataSharingService: DataSharingService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar) {
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


  onImportLecture(){
    const course = this.dataSharingService.getDataForKey('course');
    this.dialogService
      .chooseFile('Choose a lecture.json to import',
        '/api/import/lecture/' + course._id)
      .subscribe(res => {
        if (res.success) {
          // This does not work as expected
          this.dataSharingService.setDataForKey('unit-edit-element', res.result);
          this.dataSharingService.setDataForKey('unit-edit-mode', true);
          this.snackBar.open('Lecture successfully imported', '', {duration: 3000});
          this.onImport.emit();
        } else if (res.result) {
          this.snackBar.open(res.error.message, '', {duration: 3000});
        }
      });
  }
}
