import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdFabMenuComponent } from './md-fab-menu.component';

describe('MdFabMenuComponent', () => {
  let component: MdFabMenuComponent;
  let fixture: ComponentFixture<MdFabMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdFabMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdFabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
