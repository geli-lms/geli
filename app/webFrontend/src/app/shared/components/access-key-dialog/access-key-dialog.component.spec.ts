import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessKeyDialog} from './access-key-dialog.component';

describe('AccessKeyDialog', () => {
  let component: AccessKeyDialog;
  let fixture: ComponentFixture<AccessKeyDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessKeyDialog]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessKeyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
