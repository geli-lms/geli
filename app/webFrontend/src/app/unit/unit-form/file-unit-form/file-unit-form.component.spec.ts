/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FileUnitFormComponent} from './file-unit-form.component';


describe('FileUnitFormComponent', () => {
  let component: FileUnitFormComponent;
  let fixture: ComponentFixture<FileUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUnitFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
