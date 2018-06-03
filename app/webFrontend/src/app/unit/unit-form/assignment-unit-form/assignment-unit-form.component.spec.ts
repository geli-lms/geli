import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentUnitFormComponent } from './assignment-unit-form.component';

describe('AssignmentUnitFormComponent', () => {
  let component: AssignmentUnitFormComponent;
  let fixture: ComponentFixture<AssignmentUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentUnitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
