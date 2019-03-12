import {Component, OnInit, Input, AfterViewInit, EventEmitter} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ICourse} from '../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../shared/models/ILecture';
import {ExpandableDivHeaderTags} from '../shared/components/expandable-div/expandable-div-header-tags.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {IUnit} from "../../../../../shared/models/units/IUnit";
import {DataSharingService} from "../shared/services/data-sharing.service";

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit, AfterViewInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() opened: boolean;
  lectureId: string;
  unitScrollEmitter: EventEmitter<IUnit>;


  private headerTags = ExpandableDivHeaderTags;

  constructor(public userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private dataSharingService: DataSharingService) {
    this.opened = true;
  }

  ngOnInit() {
    this.unitScrollEmitter = this.dataSharingService.getDataForKey('unitScrollEmitter');


    this.route.params.subscribe(params => {
      this.lectureId = decodeURIComponent(params['lecture']);
    });
  }

  onUnitChange(unitid: string) {
    let activeUnit = this.lecture.units.find(unit => unit._id == unitid);
    if (activeUnit) {
      this.unitScrollEmitter.emit(activeUnit);
    }
  }

  ngAfterViewInit(): void {
    try {
      const element = document.getElementById(this.lectureId);
      if (element) {
        element.scrollIntoView();
      }
    } catch (err) {
    }
  }

  toggleOpen() {
    this.opened = !this.opened;
  }
}
