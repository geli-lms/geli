import {Injectable} from '@angular/core';


@Injectable()
export class WhitelistService {


  parseFileContents(content: string) {
    const rows = [ ];
    const lines = content.split(/\r?\n|\r/);
    let actualLine = 0;
    const userLines = lines.filter((line) => line.split(';').length >= 3);

    for (const singleLine of userLines) {
      actualLine++;
      const lastName = singleLine.split(';')[0];
      const firstName = singleLine.split(';')[1];
      const uid = singleLine.split(';')[2];
      if (firstName.length > 0 && lastName.length > 0 && uid.length > 0) {
        if (!isNaN(Number(firstName))) {
          continue;
        }
        if (!isNaN(Number(lastName))) {
          continue;
        }
        if (isNaN(Number(uid))) {
          continue;
        }

        rows.push({
          firstName: firstName,
          lastName: lastName,
          uid: uid
        });
      }
    }

    return rows;
  }

  parseFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file, 'ascii');
      reader.onload = (evt: any) => {
        const result = this.parseFileContents(evt.target.result);
        if (!result) {
          reject();
          return;
        }
        resolve(result);
      };

      reader.onerror = function (evt) {
        reject(evt);
      };
    });
  }

}
