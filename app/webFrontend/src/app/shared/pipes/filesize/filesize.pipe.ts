import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | filesize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {

  private units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  public transform(bytes: number = 0, precision: number = 2 ): string {
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) {
      return bytes.toString();
    }
    let unit = 0;
    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return bytes.toFixed(precision).toString().replace(/\./g, ',') + ' ' + this.units[ unit ];
  }

}
