import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFormDialog } from './upload-form-dialog.component';

describe('UploadFormDialog', () => {
  let component: UploadFormDialog;
  let fixture: ComponentFixture<UploadFormDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFormDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
