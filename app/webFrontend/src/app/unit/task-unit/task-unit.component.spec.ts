import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskUnitComponent} from './task-unit.component';

describe('TaskUnitComponent', () => {
  let component: TaskUnitComponent;
  let fixture: ComponentFixture<TaskUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskUnitComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
