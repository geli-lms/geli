import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyToolbarComponent } from './sticky-toolbar.component';

describe('StickyToolbarComponent', () => {
  let component: StickyToolbarComponent;
  let fixture: ComponentFixture<StickyToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
