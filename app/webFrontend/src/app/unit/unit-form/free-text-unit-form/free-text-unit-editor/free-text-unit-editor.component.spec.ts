import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeTextUnitEditorComponent} from './free-text-unit-editor.component';

describe('FreeTextUnitEditorComponent', () => {
  let component: FreeTextUnitEditorComponent;
  let fixture: ComponentFixture<FreeTextUnitEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextUnitEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextUnitEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
