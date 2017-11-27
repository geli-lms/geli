import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {TitleService} from '../../shared/services/title.service';

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
              private titleService: TitleService) {
    this.status = 'Activating account...';
    this.success = false;
    this.route.params.subscribe(params => {
      auth.activate(params['token'])
      .then(val => {
        this.status = 'Successfully activated your account.';
        this.success = true;
      })
      .catch(val => {
        this.status = 'Failed to activate your account.';
      });
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Activation');
  }

}
