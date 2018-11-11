import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {BackendService} from '../shared/services/backend.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {

  path = '';
  url: SafeResourceUrl | undefined;
  plainText: string | undefined;
  type: string | undefined;
  loaded: Boolean = false;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private domSanitizer: DomSanitizer) {
    this.route.params.subscribe(async params => {
      this.path = params['path'];
      if (!isNullOrUndefined(this.path)) {
        const urlPart = 'uploads/' + this.path;
        const mimeType = await this.backendService.getMimeType(urlPart);
        this.type = mimeType.split('/')[0];

        if (mimeType === 'text/plain') {
          // Read plain-text for direct embedding.
          const response = await this.backendService.getDownload(urlPart).toPromise();
          const blob = <any>response.body;
          const reader = new FileReader();
          reader.onload = () => {
            this.plainText = <string>reader.result;
            this.loaded = true;
          };
          reader.readAsText(blob);
        } else {
          this.url = this.domSanitizer.bypassSecurityTrustResourceUrl('api/' + urlPart);
          this.loaded = true;
        }
      }
    });
  }

}
