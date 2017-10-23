import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CodeKataUnitFormComponent} from './code-kata-unit-form.component';

describe('CodeKataUnitFormComponent', () => {
  let component: CodeKataUnitFormComponent;
  let fixture: ComponentFixture<CodeKataUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeKataUnitFormComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeKataUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
