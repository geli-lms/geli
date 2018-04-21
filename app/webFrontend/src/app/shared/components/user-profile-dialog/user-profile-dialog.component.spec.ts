import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserProfileDialog} from './user-profile-dialog.component';

describe('UserProfileDialog', () => {
  let component: UserProfileDialog;
  let fixture: ComponentFixture<UserProfileDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileDialog]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
