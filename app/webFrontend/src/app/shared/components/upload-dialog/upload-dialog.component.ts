import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FileItem} from 'ng2-file-upload';
import {IUser} from '../../../../../../../shared/models/IUser';
import {MatDialogRef} from '@angular/material';
import {UploadFormComponent} from '../upload-form/upload-form.component';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {SnackBarService} from '../../services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialog implements OnInit {

    @Input() user: IUser;
    @ViewChild('webcam') webcam: any;
    @ViewChild('preview') previewPicture: any;
    @ViewChild(UploadFormComponent)
    public uploadForm: UploadFormComponent;
    uploadPath: string;
    allowedMimeTypes: string[];
    mediastream: MediaStreamTrack;
    @Input() isWebcamActive: boolean;
    public pictureTaken: boolean;
    showProgressBar = false;

    constructor(
        public dialogRef: MatDialogRef<UploadDialog>,
        private snackBar: SnackBarService,
        private userService: UserService,
        private router: Router,
        private translate: TranslateService) {
    }

    ngOnInit() {
        this.uploadPath = '/api/users/picture/' + this.user._id;
        this.allowedMimeTypes = ['image/png', 'image/gif', 'image/jpg', 'image/bmp', 'image/jpeg'];
        this.isWebcamActive = true;
    }

    changedTab($event: any) {
        if ($event.index === 1) {
            this.startWebcam();
        } else {
            this.stopWebcam();
        }
    }


    private startWebcam() {
        if (!this.isWebcamActive) {
            const nativeVideo = this.webcam.nativeElement;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({video: true})
                    .then(stream => {
                        nativeVideo.srcObject = stream;
                        this.mediastream = stream.getTracks()[0];
                        nativeVideo.play();
                    })
                    .catch(error => {
                        this.isWebcamActive = false;
                        this.snackBar.open('Couldn\'t start webcam');
                    });
            }
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

    public addImage() {
        this.dialogRef.disableClose = true;
        this.showProgressBar = true;
        const imageData = this.previewPicture.nativeElement.src;
        this.convertToFile(imageData, 'webcam.png', 'image/png')
            .then((file) => {
                const fileItem = new FileItem(this.uploadForm.fileUploader, file, {});
                this.uploadForm.fileUploader.queue.push(fileItem);
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
        this.uploadForm.fileUploader.cancelAll();
        this.dialogRef.close(false);
    }

    public startUpload() {
        try {
            this.uploadForm.fileUploader.uploadAll();
        } catch (error) {
            this.snackBar.open('An error occured during the Upload');
        }
    }

    public onFileUploaded(event: IFileUnit) {
    }

    public onAllUploaded() {
        this.dialogRef.close(true);
    }

    public isObjectInQueue() {
        if (this.uploadForm) {
            return this.uploadForm.fileUploader.queue.length > 0;
        }
    }
}
