import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FileUnitComponent} from './file-unit.component';

describe('FileUnitComponent', () => {
  let component: FileUnitComponent;
  let fixture: ComponentFixture<FileUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUnitComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
