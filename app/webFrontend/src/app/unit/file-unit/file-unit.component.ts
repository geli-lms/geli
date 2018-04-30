import {Component, OnInit, Input, ViewChildren, QueryList, Directive, AfterViewInit, ElementRef} from '@angular/core';
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
  @ViewChildren('vid') vidChilds: QueryList<any>;
  videosLoaded = 0;
  smallestVideoSize = 1080;

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

  loadedVideos($event) {
    const vidWidth = $event.target.videoWidth;
      if (vidWidth < this.smallestVideoSize) {
      this.smallestVideoSize = vidWidth;
    }
    this.videosLoaded += 1;
    if (this.videosLoaded === this.fileUnit.files.length) {
      if (this.smallestVideoSize > $event.target.parentElement.clientWidth) {
        this.smallestVideoSize = $event.target.parentElement.clientWidth;
      }
      this.setSmallestVideoWidth(this.smallestVideoSize);
    }
  }

  setSmallestVideoWidth(width: number): void {
    this.vidChilds.forEach(vidChild => {
      vidChild.nativeElement.width =  width;
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
