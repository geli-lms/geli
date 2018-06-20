import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleDropdownComponent } from './user-role-dropdown.component';

describe('UserRoleDropdownComponent', () => {
  let component: UserRoleDropdownComponent;
  let fixture: ComponentFixture<UserRoleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
