import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {TitleService} from '../../shared/services/title.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  status: string;
  success: boolean;

  constructor(private route: ActivatedRoute,
              private auth: AuthenticationService,
              private titleService: TitleService,
              translate: TranslateService) {
    translate.get('activation.text.activating').subscribe((t: string) => {
      this.status = t['activation.text.activating'];
    });
    this.success = false;
    this.route.params.subscribe(params => {
      auth.activate(params['token'])
      .then(val => {
        translate.get('activation.text.success').subscribe((t: string) => {
          this.status = t['activation.text.success'];
        });
        this.success = true;
      })
      .catch(val => {
        translate.get('activation.text.failed').subscribe((t: string) => {
          this.status = t['activation.text.failed'];
        });
      });
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Activation');
  }

}
