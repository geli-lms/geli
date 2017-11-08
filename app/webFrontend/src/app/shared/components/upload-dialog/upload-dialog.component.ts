import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {IUser} from '../../../../../../../shared/models/IUser';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialog implements OnInit {

  @Input() user: IUser;
  @ViewChild('webcam') webcam: any;
  @ViewChild('preview') previewPicture: any;

  public uploader: FileUploader;
  mediastream: MediaStreamTrack;

  public pictureTaken: boolean;
  showProgressBar = false;

  constructor(public dialogRef: MatDialogRef<UploadDialog>) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: '/api/users/picture/' + this.user._id,
      headers: [{
        name: 'Authorization',
        value: localStorage.getItem('token')
      }]
    });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.stopWebcam();

      return this.dialogRef.close({success: true, user: JSON.parse(response)});
    };
  }

  changedTab($event: any) {
    if ($event.index === 1) {
      this.startWebcam();
    } else {
      this.stopWebcam();
    }
  }

  private startWebcam() {
    const nativeVideo = this.webcam.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
      .then(stream => {
        nativeVideo.srcObject = stream;
        this.mediastream = stream.getTracks()[0];
        nativeVideo.play();
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  private stopWebcam() {
    if (this.mediastream) {
      this.mediastream.stop();
    }
  }

  public takePicture() {
    const nativeVideo = this.webcam.nativeElement;
    const nativePreview = this.previewPicture.nativeElement;

    const canvas = document.createElement('canvas');
    const videoWidth = nativeVideo.offsetWidth;
    const videoHeight = nativeVideo.offsetHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(nativeVideo, 0, 0, videoWidth, videoHeight);

    nativePreview.src = canvas.toDataURL('image/png');
    this.pictureTaken = true;
  }

  public uploadImage(){
    this.dialogRef.disableClose = true;
    this.showProgressBar = true;
    this.uploader.uploadAll();
  }

  public addImage() {
    this.dialogRef.disableClose = true;
    this.showProgressBar = true;
    const imageData = this.previewPicture.nativeElement.src;
    this.convertToFile(imageData, 'webcam.png', 'image/png')
    .then((file) => {
      const fileItem = new FileItem(this.uploader, file, {});
      this.uploader.queue.push(fileItem);
      fileItem.upload();
    });
  }

  private convertToFile(url, filename, mimeType) {
    return (fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buf) => {
        return new File([buf], filename, {type: mimeType});
      })
    );
  }

  public cancel() {
    this.stopWebcam();
    this.uploader.cancelAll();
    this.dialogRef.close(false);
  }

}
