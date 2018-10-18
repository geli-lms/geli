import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LicensesComponent} from './licenses.component';
import {MaterialImportModule} from '../../shared/modules/material-import.module';

describe('LicensesComponent', () => {
  let component: LicensesComponent;
  let fixture: ComponentFixture<LicensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportModule],
      declarations: [LicensesComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
