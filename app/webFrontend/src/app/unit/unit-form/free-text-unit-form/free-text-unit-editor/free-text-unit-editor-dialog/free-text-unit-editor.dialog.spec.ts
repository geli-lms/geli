import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeTextUnitEditorDialog} from './free-text-unit-editor.dialog';

describe('FreeTextUnitEditorDialog', () => {
  let component: FreeTextUnitEditorDialog;
  let fixture: ComponentFixture<FreeTextUnitEditorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextUnitEditorDialog]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextUnitEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
