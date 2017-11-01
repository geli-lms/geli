import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDialog } from './upload-dialog.component';

describe('UploadDialog', () => {
  let component: UploadDialog;
  let fixture: ComponentFixture<UploadDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
