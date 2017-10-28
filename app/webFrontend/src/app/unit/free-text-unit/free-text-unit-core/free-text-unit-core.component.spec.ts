import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeTextUnitCoreComponent} from './free-text-unit-core.component';

describe('FreeTextUnitCoreComponent', () => {
  let component: FreeTextUnitCoreComponent;
  let fixture: ComponentFixture<FreeTextUnitCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextUnitCoreComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextUnitCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
