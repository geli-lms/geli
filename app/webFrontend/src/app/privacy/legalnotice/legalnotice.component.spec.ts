import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalnoticeComponent } from './legalnotice.component';

describe('LegalnoticeComponent', () => {
  let component: LegalnoticeComponent;
  let fixture: ComponentFixture<LegalnoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalnoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
