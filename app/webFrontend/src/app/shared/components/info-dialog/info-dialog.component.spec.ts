import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoDialog} from './info-dialog.component';

describe('InfoDialog', () => {
  let component: InfoDialog;
  let fixture: ComponentFixture<InfoDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialog]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
