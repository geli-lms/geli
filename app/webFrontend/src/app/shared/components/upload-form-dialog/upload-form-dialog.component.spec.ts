import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFormDialogComponent } from './upload-form-dialog.component';

describe('UploadFormDialogComponent', () => {
  let component: UploadFormDialogComponent;
  let fixture: ComponentFixture<UploadFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
