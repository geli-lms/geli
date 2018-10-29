import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from '../../services/snack-bar.service';

@Component({
    selector: 'app-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit, OnChanges {

    @Input() uploadPath: string;
    @Input() uploadMethod = 'POST';
    @Input() allowedMimeTypes: string[];
    @Input() additionalData: any;
    @Input() maxFileNumber: number;
    @Input() uploadSingleFile: boolean;
    @Input() profilePictureUrl: string;
    @Output() onFileSelectedChange = new EventEmitter();
    @Output() onFileUploaded = new EventEmitter();
    @Output() onAllUploaded = new EventEmitter();

    hasDropZoneOver = false;
    fileUploader: FileUploader;

    private first = true;
    private updateUploadParams = false;
    private error = false;

    constructor(private snackBar: SnackBarService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        const uploadOptions: FileUploaderOptions = {
            url: this.uploadPath,
            method: this.uploadMethod,
            authToken: localStorage.getItem('token'),
            allowedMimeType: this.allowedMimeTypes,
            removeAfterUpload: true
        };

        if (this.maxFileNumber) {
            uploadOptions.queueLimit = this.maxFileNumber;
        }

        this.fileUploader = new FileUploader(uploadOptions);

        this.fileUploader.onCancelItem = (file) => {
            // set error true, so dialog is not closed automatically
            this.error = true;
            this.snackBar.open(`upload cancelled for ${file._file.name}`);
        };

        this.fileUploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('data', JSON.stringify(this.additionalData));
        };

        this.fileUploader.onBeforeUploadItem = (fileItem) => {
            if (this.updateUploadParams) {
                fileItem.method = this.uploadMethod;

                if (fileItem.url !== this.uploadPath) {
                    fileItem.url = this.uploadPath;
                }
            }
        };

        this.fileUploader.onCompleteAll = () => {
            if (!this.error && this.fileUploader.queue.length === 0) {
                this.onAllUploaded.emit();
            }
        };

        this.fileUploader.onCompleteItem = (file, response, status, headers) => {
            try {
                const responseObject = JSON.parse(response);

                if (status === 200) {
                    this.error = false;
                }
                if (responseObject._id && status === 200) {
                    if (this.first) {
                        this.first = false;
                    }
                    // all subsequent (if any) uploads will be added to this unit
                    this.onFileUploaded.emit(responseObject);
                }
            } catch (e) {

            }
        };

        this.fileUploader.onAfterAddingAll = (fileItems) => {
            this.onFileSelectedChange.emit(true);
        };

        this.fileUploader.onErrorItem = (item, response, status, headers) => {
            this.error = true;
            // reset the error state to try again later
            item.isError = false;
            item.isUploaded = false;
            this.snackBar.open(`${item._file.name} failed to upload`);
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('uploadPath') && changes.hasOwnProperty('uploadMethod') && !this.first) {
            this.updateUploadParams = true;
            this.uploadNextItem();
        }
    }

    clearQueue() {
        this.fileUploader.clearQueue();
        if (this.fileUploader.queue.length > 0) {
            this.snackBar.open('Queue couldn\'t be cleared.');
        } else {
            this.onFileSelectedChange.emit(false);
        }
    }

    uploadNextItem() {
        if (this.fileUploader.getNotUploadedItems().length) {
            this.fileUploader.uploadItem(this.fileUploader.getNotUploadedItems()[0]);
        }
    }

    onFileOverDropzone(event) {
        this.hasDropZoneOver = event;
    }

    onSelectFile(event) {
        this.preparePreviewImage(event);
        this.checkMimeTypeOfFile(event);
    }

    checkMimeTypeOfFile(event) {
        if (this.maxFileNumber === 1 && this.fileUploader.queue.length === 0) {
            const fileType = event.target.files[0];
            if (fileType === '' || this.allowedMimeTypes.findIndex(item => item === fileType) === -1) {
                this.translate.get(['common.validation.wrong_mimeType', 'common.dismiss']).subscribe((t: string) => {
                    this.snackBar.open(t['common.validation.wrong_mimeType'], t['common.dismiss']);
                });
            }
        }
    }

    preparePreviewImage(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]);

            reader.onload = (ev) => {
                const target: any = ev.target;
                const content: string = target.result;
                this.profilePictureUrl = content;
            };
        }
    }
}
