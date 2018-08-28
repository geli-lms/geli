import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ResponsiveImageUploadDialog} from './responsive-image-upload-dialog.component';

describe('ResponsiveImageUploadDialog', () => {
  let component: ResponsiveImageUploadDialog;
  let fixture: ComponentFixture<ResponsiveImageUploadDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResponsiveImageUploadDialog]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveImageUploadDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
