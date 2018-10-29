import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminMiscComponent} from './admin-misc.component';

describe('AdminMiscComponent', () => {
  let component: AdminMiscComponent;
  let fixture: ComponentFixture<AdminMiscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMiscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
