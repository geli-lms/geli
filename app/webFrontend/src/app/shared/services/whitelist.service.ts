import {Injectable} from '@angular/core';
import {WhitelistUserService} from './data.service';


@Injectable()
export class WhitelistService {

  constructor(private whitelistUserService: WhitelistUserService) {

  }

  parseFileContents(content: string) {
    const rows = [ ];
    const errors = [ ];

    const lines = content.split(/\r?\n|\r/);
    let actualLine = 0;
    const userLines = lines.filter((line) => line.split(';').length >= 3);

    for (const singleLine of lines) {

      if (singleLine.split(';').length < 3) {
        actualLine++;
        continue;
      }

      actualLine++;

      const lastName = singleLine.split(';')[0];
      const firstName = singleLine.split(';')[1];
      const uid = singleLine.split(';')[2];
      if (firstName.length > 0 && lastName.length > 0 && uid.length > 0) {
        if (!isNaN(Number(firstName))) {
          errors.push({ line: actualLine, error: 'The first name cannot be a number.' });
          continue;
        }

        if (!isNaN(Number(lastName))) {
          errors.push({ line: actualLine, error: 'The last name cannot be a number.' });

          continue;
        }
        if (isNaN(Number(uid))) {
          errors.push({ line: actualLine, error: 'The uid is not a number.' });

          continue;
        }

        rows.push({
          firstName: firstName,
          lastName: lastName,
          uid: uid
        });
      } else {
        errors.push({ line: actualLine, error: 'Some fields are missing.' });
      }
    }

    return { rows: rows, errors: errors };
  }

  parseFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file, 'ISO-8859-1');
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
