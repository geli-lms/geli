import {TestBed, inject} from '@angular/core/testing';
import {FileIconService} from './file-icon.service';

describe('FileIconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileIconService]
    });
  });

  it('should be created', inject([FileIconService], (service: FileIconService) => {
    expect(service).toBeTruthy();
  }));

  it('should return archive for zip', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('application/zip')).toBe('archive');
  }));

  it('should return document for docx', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe('book');
  }));

  it('should return image for any image', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('image/jpeg')).toBe('image');
    expect(service.mimeTypeToIcon('image/geli')).toBe('image');
  }));

  it('should return picture_as_pdf for pdf', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('application/pdf')).toBe('picture_as_pdf');
  }));

  it('should return video for any video ', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('video/mpeg')).toBe('movie');
    expect(service.mimeTypeToIcon('video/geli')).toBe('movie');
  }));

  it('should return code for any text ', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('text/html')).toBe('code');
    expect(service.mimeTypeToIcon('text/geli')).toBe('code');
  }));

  it('should return attachment for unknown mime type', inject([FileIconService], (service: FileIconService) => {
    expect(service.mimeTypeToIcon('application/geli')).toBe('attachment');
  }));

});
