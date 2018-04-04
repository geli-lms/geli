import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickMediaDialog } from './pick-media-dialog.component';

describe('PickMediaDialog', () => {
  let component: PickMediaDialog;
  let fixture: ComponentFixture<PickMediaDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickMediaDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickMediaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
