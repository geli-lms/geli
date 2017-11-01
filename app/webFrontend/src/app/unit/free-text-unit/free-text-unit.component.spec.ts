import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeTextUnitComponent} from './free-text-unit.component';

describe('FreeTextUnitComponent', () => {
  let component: FreeTextUnitComponent;
  let fixture: ComponentFixture<FreeTextUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FreeTextUnitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
