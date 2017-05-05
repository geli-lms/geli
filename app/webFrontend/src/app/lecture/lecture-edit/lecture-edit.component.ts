import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LectureService} from '../../shared/services/data.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';

@Component({
  selector: 'app-lecture-edit',
  templateUrl: './lecture-edit.component.html',
  styleUrls: ['./lecture-edit.component.scss']
})
export class LectureEditComponent implements OnInit {

  name: string;
  description: string;
  cid: string;
  lid: string;
  lectureOb: any[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private lectureService: LectureService,
              private showProgress: ShowProgressService) {

    this.route.params.subscribe(params => {
      this.cid = params['cid'];
      this.lid = params['lid'];
    });

    this.lectureService.readSingleItem(this.lid).then(
      (val: any) => {
        this.name = val.name;
        this.description = val.description;
        this.lectureOb = val;
      }, (error) => {
        console.log(error);
      });
  }

  ngOnInit() {

  }

  updateLecture() {
    this.showProgress.toggleLoadingGlobal(true);

    this.lectureService.updateItem({'name': this.name, 'description': this.description, '_id': this.lid})
      .then((val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      })
      .then(() => {
        const url = `/course/edit/${this.cid}`;
        this.router.navigate([url]);
      });
  }

}
