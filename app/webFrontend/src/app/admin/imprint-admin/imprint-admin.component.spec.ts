import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprintAdminComponent } from './imprint-admin.component';

describe('ImprintAdminComponent', () => {
  let component: ImprintAdminComponent;
  let fixture: ComponentFixture<ImprintAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprintAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprintAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
