import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../shared/services/backend.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-misc',
  templateUrl: './admin-misc.component.html',
  styleUrls: ['./admin-misc.component.scss']
})
export class AdminMiscComponent implements OnInit {

  constructor(private backendService: BackendService,
              private snackBar: SnackBarService,
              private translate: TranslateService) {
  }

  ngOnInit() {
  }

  async clearCache() {
    try {
      await this.backendService.delete('download/cache').toPromise();
    } catch (error) {
      const msgPrefix = await this.translate.get('admin.cache.clear.failed').toPromise();
      this.snackBar.openLong(msgPrefix + ': ' + error.message);
    }
  }

}
