import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurablePagesFormComponent } from './configurable-pages-form.component';

describe('ConfigurablePagesFormComponent', () => {
  let component: ConfigurablePagesFormComponent;
  let fixture: ComponentFixture<ConfigurablePagesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurablePagesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurablePagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
