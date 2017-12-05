import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteMailDialog } from './write-mail-dialog.component';

describe('WriteMailDialog', () => {
  let component: WriteMailDialog;
  let fixture: ComponentFixture<WriteMailDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteMailDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteMailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
