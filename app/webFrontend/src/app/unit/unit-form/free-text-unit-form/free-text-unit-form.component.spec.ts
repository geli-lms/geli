import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeTextUnitFormComponent} from './free-text-unit-form.component';

describe('FreeTextUnitFormComponent', () => {
  let component: FreeTextUnitFormComponent;
  let fixture: ComponentFixture<FreeTextUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextUnitFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
