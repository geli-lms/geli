import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentUnitComponent } from './assignment-unit.component';

describe('AssignmentUnitComponent', () => {
  let component: AssignmentUnitComponent;
  let fixture: ComponentFixture<AssignmentUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
