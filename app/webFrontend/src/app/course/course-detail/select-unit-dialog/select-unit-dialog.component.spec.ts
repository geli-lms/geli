import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnitDialogComponent } from './select-unit-dialog.component';

describe('SelectUnitDialogComponent', () => {
  let component: SelectUnitDialogComponent;
  let fixture: ComponentFixture<SelectUnitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUnitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUnitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
