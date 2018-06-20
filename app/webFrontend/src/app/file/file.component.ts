import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {BackendService} from '../shared/services/backend.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnDestroy {

  path = '';
  blob: Blob | undefined;
  objectUrl: string | undefined;
  data: SafeResourceUrl | undefined;
  plainText: string | undefined;
  loaded: Boolean = false;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private domSanitizer: DomSanitizer) {
    this.route.params.subscribe(async params => {
      this.path = params['path'];
      if (!isNullOrUndefined(this.path)) {
        const urlPart = 'uploads/' + this.path;
        const response = await this.backendService.getDownload(urlPart).toPromise();
        this.blob = <any>response.body;

        if (this.blob.type === 'text/plain') {
          // Read plain-text for direct embedding.
          const reader = new FileReader();
          reader.onload = () => {
            this.plainText = reader.result;
            this.loaded = true;
          };
          reader.readAsText(this.blob);
        } else {
          // Create an object URL from the blob.
          this.objectUrl = URL.createObjectURL(this.blob);
          this.data = this.domSanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
          this.loaded = true;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  get isPlainText () {
    return this.plainText !== undefined;
  }

}
