import {Component, OnInit, Input} from '@angular/core';
import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';
import {Lightbox, IAlbum} from 'angular2-lightbox';

@Component({
  selector: 'app-file-unit',
  templateUrl: './file-unit.component.html',
  styleUrls: ['./file-unit.component.scss']
})
export class FileUnitComponent implements OnInit {

  @Input() fileUnit: IFileUnit;
  album: Array<IAlbum> = [];

  constructor(private lightbox: Lightbox) {
  }

  ngOnInit() {
    this.fileUnit.files.forEach(file => {
      if (this.isPicture(file.name)) {
        const src = '/api/uploads/' + file.link;
        const thumb = src;
        const caption = file.name;
        const image = {
          src: src,
          thumb: thumb,
          caption: caption,
        };
        this.album.push(image);
      }
    });
  }

  openLB(index: number): void {
    this.lightbox.open(this.album, index);
  }

  isPicture(fileName: string) {
    const pictureExt: any = [
      'jpg',
      'jpeg',
      'png',
      'apng',
      'svg',
      'bmp',
      'ico',
    ];
    const extPos = fileName.lastIndexOf('.');
    if (extPos === -1) {
      return false;
    }
    const ext = fileName.substr(extPos + 1);
    return pictureExt.includes(ext);
  }

}
