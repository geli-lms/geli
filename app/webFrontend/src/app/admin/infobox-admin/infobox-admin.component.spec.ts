import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoboxAdminComponent } from './infobox-admin.component';

describe('InfoboxAdminComponent', () => {
  let component: InfoboxAdminComponent;
  let fixture: ComponentFixture<InfoboxAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoboxAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoboxAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
