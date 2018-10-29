import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../shared/services/title.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent {

  id: string;
  tabs = [];

  constructor(private route: ActivatedRoute,
              private titleService: TitleService,
              private translate: TranslateService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Edit Course');
    this.translate.onLangChange.subscribe(() => {
      this.reloadTabBar();
    });
    this.reloadTabBar();
  }

  reloadTabBar(): void {
    this.tabs.length = 0;
    this.translate.get(['common.content', 'common.general', 'common.media', 'common.members', 'common.teachers'])
      .subscribe((t: string) => {
        this.tabs.push({path: '.', label: t['common.general']});
        this.tabs.push({path: 'content', label: t['common.content']});
        this.tabs.push({path: 'media', label: t['common.media']});
        this.tabs.push({path: 'members', label: t['common.members']});
        this.tabs.push({path: 'teachers', label: t['common.teachers']});
      });
  }
}
