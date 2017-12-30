import {Injectable} from '@angular/core';

@Injectable()
export class SaveFileService {

  constructor() {
  }

  replaceCharInFilename(filename: string) {
    return filename.replace(/[^a-zA-Z0-9 -]/g, '')    // remove special characters
      .replace(/ /g, '-')             // replace space by dashes
      .replace(/-+/g, '-');
  }

  save(name: string, content: string, fileEnding: string, type: string, downloadType: string) {
    const filename = this.replaceCharInFilename(name) + fileEnding;
    const blob = new Blob(
      [content],
      {type: type});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = [downloadType, a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }
}
