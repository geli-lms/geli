import {Injectable} from '@angular/core';

@Injectable()
export class SaveFileService {

  constructor() {
  }

  save(name: string, content: string) {
    const filename = name
        .replace(/[^a-zA-Z0-9 -]/g, '')    // remove special characters
        .replace(/ /g, '-')             // replace space by dashes
        .replace(/-+/g, '-')            // trim multiple dashes
      + '.json';
    const blob = new Blob(
      [content],
      {type: 'application/json'});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }
}
