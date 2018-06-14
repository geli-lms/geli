import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FilepickerDialog} from './filepicker-dialog.component';


describe('FilepickerDialog', () => {
  let component: FilepickerDialog;
  let fixture: ComponentFixture<FilepickerDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilepickerDialog]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilepickerDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
