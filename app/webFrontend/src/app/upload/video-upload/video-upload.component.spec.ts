/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoUploadComponent} from './video-upload.component';

describe('VideoUploadComponent', () => {
  let component: VideoUploadComponent;
  let fixture: ComponentFixture<VideoUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoUploadComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
