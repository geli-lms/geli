import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurablePagesComponent } from './configurable-pages.component';

describe('ConfigurablePagesComponent', () => {
  let component: ConfigurablePagesComponent;
  let fixture: ComponentFixture<ConfigurablePagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurablePagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurablePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
