import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeKataUnitEditComponent } from './code-kata-unit-edit.component';

describe('CodeKataUnitEditComponent', () => {
  let component: CodeKataUnitEditComponent;
  let fixture: ComponentFixture<CodeKataUnitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeKataUnitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeKataUnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
