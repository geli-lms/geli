import {Component, OnInit, Input, ViewChildren, QueryList, Directive, AfterViewInit, ElementRef} from '@angular/core';
import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';
import {Lightbox, IAlbum} from 'ngx-lightbox';
import {FileIconService} from '../../shared/services/file-icon.service';
import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

@Component({
  selector: 'app-file-unit',
  templateUrl: './file-unit.component.html',
  styleUrls: ['./file-unit.component.scss']
})
export class FileUnitComponent implements OnInit {
  @Input() fileUnit: IFileUnit;
  album: Array<IAlbum> = [];
  files: Array<IFile> = [];
  @ViewChildren('vid') vidChilds: QueryList<any>;
  videosLoaded = 0;
  smallestVideoSize = 1080;

  constructor(private lightbox: Lightbox, private fileIcon: FileIconService) {
  }

  ngOnInit() {
    this.fileUnit.files.forEach(file => {
      if (this.fileIcon.isImage(file.mimeType)) {
        const src = '/api/uploads/' + file.link;
        this.album.push({src: src, thumb: src, caption: file.name});
      } else {
        this.files.push(file);
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
      vidChild.nativeElement.width = width;
    });
  }

  openLB(index: number): void {
    this.lightbox.open(this.album, index);
  }
}
