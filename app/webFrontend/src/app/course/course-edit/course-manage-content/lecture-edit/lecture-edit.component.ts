import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {DuplicationService, ExportService, LectureService, UnitService} from '../../../../shared/services/data.service';
import {ShowProgressService} from 'app/shared/services/show-progress.service';
import {DialogService} from '../../../../shared/services/dialog.service';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material';
import {IUnit} from '../../../../../../../../shared/models/units/IUnit';
import {DragulaService} from 'ng2-dragula';
import {SaveFileService} from '../../../../shared/services/save-file.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSharingService} from '../../../../shared/services/data-sharing.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-lecture-edit',
  templateUrl: './lecture-edit.component.html',
  styleUrls: ['./lecture-edit.component.scss']
})
export class LectureEditComponent implements OnInit, OnDestroy {
  @Input() lecture: ILecture;
  @Input() course: ICourse;

  onCloseAllForms: Subject<void>;
  onReloadCourse: Subject<Function>;

  constructor(private route: ActivatedRoute,
              private lectureService: LectureService,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private dialogService: DialogService,
              private dragulaService: DragulaService,
              private duplicationService: DuplicationService,
              private exportService: ExportService,
              private saveFileService: SaveFileService,
              public userService: UserService,
              private dataSharingService: DataSharingService,
              private router: Router) {
  }

  ngOnInit() {
    this.onCloseAllForms = this.dataSharingService.getDataForKey('onCloseAllForms');
    this.onCloseAllForms.asObservable().subscribe(() => this.closeAllForms());
    this.onReloadCourse = this.dataSharingService.getDataForKey('onReloadCourse');
  }

  ngOnDestroy() {}

  isDraggingUnit() {
    return this.dragulaService.find('units').drake.dragging;
  }

  async duplicateLecture(lecture: ILecture) {
    try {
      const duplicateLecture = await this.duplicationService.duplicateLecture(lecture, this.course._id);
      this.snackBar.open('Lecture duplicated.', '', {duration: 3000});
      await this.reloadCourse();
      this.navigateToLecture(duplicateLecture._id);
    } catch (err) {
      this.snackBar.open(err, '', {duration: 3000});
    }
  }

  async duplicateUnit(unit: IUnit) {
    try {
      const duplicateUnit = await this.duplicationService.duplicateUnit(unit, this.lecture._id , this.course._id);
      this.snackBar.open('Unit duplicated.', '', {duration: 3000});
      await this.reloadCourse();
      this.navigateToUnitEdit(duplicateUnit._id);
    } catch (err) {
      this.snackBar.open(err, '', {duration: 3000});
    }
  }

  async exportLecture(lecture: ILecture) {
    try {
      const lectureJSON = await this.exportService.exportLecture(lecture);

      this.saveFileService.save(lecture.name, JSON.stringify(lectureJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export lecture failed ' + err.json().message, 'Dismiss');
    }
  }

  updateLecture(lecture: ILecture) {
    this.showProgress.toggleLoadingGlobal(true);

    this.lectureService.updateItem(lecture)
      .then(() => {
        this.dataSharingService.setDataForKey('lecture-edit-mode', false);
      })
      .catch(console.error)
      .then(() => this.showProgress.toggleLoadingGlobal(false));
  }



  deleteUnit(unit: IUnit) {
    this.dialogService
      .confirmDelete('unit', unit.__t)
      .subscribe(res => {
        if (res) {
          this.showProgress.toggleLoadingGlobal(true);
          this.unitService.deleteItem(unit)
            .then(async () => {
              this.snackBar.open('Unit deleted.', '', {duration: 3000});
              await this.reloadCourse();
              this.closeEditUnit();
            })
            .catch((error) => {
              this.snackBar.open(error, '', {duration: 3000});
            })
            .then(() => {
              this.showProgress.toggleLoadingGlobal(false);
            });
        }
      });
  }

  getDataForKey(key) {
    return this.dataSharingService.getDataForKey(key);
  }

  deleteLecture(lecture: ILecture) {
    this.dialogService
      .confirmDelete('lecture', lecture.name)
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.showProgress.toggleLoadingGlobal(true);
        this.lectureService.deleteItem(lecture)
          .then((val) => {
            this.snackBar.open('Lecture deleted.', '', {duration: 3000});
            this.unsetUnitEdit();
            this.closeEditLecture();
            this.reloadCourse();
          })
          .catch((error) => {
            this.snackBar.open(error, '', {duration: 3000});
          })
          .then(() => {
            this.showProgress.toggleLoadingGlobal(false);
          });
      });
  }

  reloadCourse() {
    // this works because we only have single course-manage-content component
    return new Promise(resolve => {
      this.onReloadCourse.next(resolve);
    });
  }

  onEditLecture() {
    this.closeAllForms();

    this.dataSharingService.setDataForKey('lecture-edit-mode', true);
    this.dataSharingService.setDataForKey('openLectureId', this.lecture._id);
    this.navigateToThisLecture();
  }

  closeEditLecture = () => {
    this.dataSharingService.setDataForKey('lecture-edit-mode', false);
  };


  onAddUnitDone = async () => {
    await this.reloadCourse();
    this.closeAddUnit();
  };

  closeAddUnit = () => {
    this.unsetAddUnit();
    this.navigateToThisLecture();
  };

  unsetAddUnit() {
    this.dataSharingService.setDataForKey('unit-create-mode', false);
    this.dataSharingService.setDataForKey('unit-create-type', null);
  }

  onEditUnit = (unit: IUnit) => {
    const isOpen = this.isUnitCurrentlyOpen(unit);
    this.closeAllForms();
    if (isOpen) {
      return this.navigateToThisLecture();
    }

    this.dataSharingService.setDataForKey('unit-edit-mode', true);
    this.dataSharingService.setDataForKey('unit-edit-element', unit);
    this.navigateToUnitEdit(unit._id);
  };

  isUnitCurrentlyOpen(unit: IUnit) {
    const isInEditMode = this.dataSharingService.getDataForKey('unit-edit-mode');
    const isSameUnit = this.dataSharingService.getDataForKey('unit-edit-element') === unit;
    return isInEditMode && isSameUnit;
  }

  onExportUnit = async (unit: IUnit) => {
    try {
      const unitJSON = await this.exportService.exportUnit(unit);

      this.saveFileService.save(unit.name, JSON.stringify(unitJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export unit failed ' + err.json().message, 'Dismiss');
    }
  };

  onEditUnitDone = async () => {
    await this.reloadCourse();
    this.closeEditUnit();
  };

  closeEditUnit = () => {
    this.unsetUnitEdit();
    this.navigateToThisLecture();
  };

  unsetUnitEdit() {
    this.dataSharingService.setDataForKey('unit-edit-mode', false);
    this.dataSharingService.setDataForKey('unit-edit-element', null);
  }

  private closeAllForms() {
    this.closeEditLecture();
    this.unsetAddUnit();
    this.unsetUnitEdit();
  }

  isOpened() {
    return this.dataSharingService.getDataForKey('openLectureId') === this.lecture._id;
  }

  navigateToThisLecture() {
    this.navigateToLecture(this.lecture._id);
  }

  navigateToLecture(lectureId: string) {
    this.route.url.subscribe(segments => {
      let path = segments.map(() => '../').join('') || '';
      path += `lecture/${lectureId}`;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }

  navigateToUnitEdit(unitId) {
    this.route.url.subscribe(segments => {
      let path = segments.map(() => '../').join('') || '';
      path += `lecture/${this.lecture._id}/unit/${unitId}`;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }

  navigateToRoot() {
    this.route.url.subscribe(segments => {
      const path = segments.map(() => '../').join('') || '';
      this.router.navigate([path], {relativeTo: this.route});
    });
  }

  toggleLecture() {
    this.onCloseAllForms.next();

    const openLectureId = this.dataSharingService.getDataForKey('openLectureId');
    if (openLectureId && openLectureId === this.lecture._id) {
      this.dataSharingService.setDataForKey('openLectureId', null);
      this.navigateToRoot();
    } else {
      this.dataSharingService.setDataForKey('openLectureId', this.lecture._id);
      this.navigateToThisLecture();
    }
  }
}
