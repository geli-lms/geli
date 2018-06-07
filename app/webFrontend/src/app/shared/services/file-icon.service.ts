import {Injectable} from '@angular/core';
import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

@Injectable()
export class FileIconService {

  /**
   * Return icon for file object
   * @param {IFile} file
   * @returns {string}
   */
  fileToIcon(file: IFile): string {
    return this.mimeTypeToIcon(file.mimeType);
  }

  /**
   * Return icon for mime type
   * @param {string} mimeType
   * @returns {string}
   */
  mimeTypeToIcon(mimeType: string): string {
    mimeType = mimeType.toLowerCase();

    if (this.isArchive(mimeType)) {
      return 'archive';
    }

    if (this.isDocument(mimeType)) {
      return 'book';
    }

    if (this.isImage(mimeType)) {
      return 'image';
    }

    if (this.isPdf(mimeType)) {
      return 'picture_as_pdf';
    }

    if (this.isText(mimeType)) {
      return 'code';
    }

    if (this.isVideo(mimeType)) {
      return 'movie';
    }

    return 'attachment';
  }

  /**
   * True when file is an archive
   * @param {string} mimeType
   * @returns {boolean}
   */
  isArchive(mimeType: string): boolean {
    const archives = [
      'application/x-bzip',
      'application/x-bzip2',
      'application/x-rar-compressed',
      'application/x-tar',
      'application/x-zip-compressed',
      'application/zip',
      'application/x-7z-compressed',
    ];

    return archives.indexOf(mimeType) >= 0;
  }

  /**
   * True when file is a document
   * @param {string} mimeType
   * @returns {boolean}
   */
  isDocument(mimeType: string): boolean {
    const documents = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    return documents.indexOf(mimeType) >= 0;
  }

  /**
   * True when file is an image
   * @param {string} mimeType
   * @returns {boolean}
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image');
  }

  /**
   * True when file is a pdf
   * @param {string} mimeType
   * @returns {boolean}
   */
  isPdf(mimeType: string): boolean {
    return mimeType === 'application/pdf';
  }

  /**
   * True when file is a text document
   * @param {string} mimeType
   * @returns {boolean}
   */
  isText(mimeType: string): boolean {
    return mimeType.startsWith('text');
  }

  /**
   * True when file is an video
   * @param {string} mimeType
   * @returns {boolean}
   */
  isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video');
  }

}
