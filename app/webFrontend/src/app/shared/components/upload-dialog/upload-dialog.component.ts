import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {IUser} from '../../../../../../../shared/models/IUser';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialog implements OnInit, AfterViewInit {

  @Input() user: IUser;
  @ViewChild('webcam') webcam: any;

  uploader: FileUploader;

  constructor(public dialogRef: MdDialogRef<UploadDialog>) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: '/api/users/' + this.user._id + '/picture',
      headers: [{
        name: 'Authorization',
        value: localStorage.getItem('token')
      }]
    });
  }

  ngAfterViewInit(): void {
    const nativeVideo = this.webcam.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
          nativeVideo.src = window.URL.createObjectURL(stream);
          nativeVideo.play();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  changedTab($event: any) {
    const debug = 0;
    if ($event.index === 1) {
      this.startWebcam();
    } else {
      this.stopWebcam();
    }
  }

  private startWebcam() {

  }

  private stopWebcam() {

  }

}
