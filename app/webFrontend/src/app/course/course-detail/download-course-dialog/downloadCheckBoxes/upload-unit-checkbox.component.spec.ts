import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUnitCheckboxComponent } from './upload-unit-checkbox.component';

describe('UploadUnitCheckboxComponent', () => {
  let component: UploadUnitCheckboxComponent;
  let fixture: ComponentFixture<UploadUnitCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadUnitCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUnitCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
