import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatFabMenuComponent} from './mat-fab-menu.component';

describe('MatFabMenuComponent', () => {
  let component: MatFabMenuComponent;
  let fixture: ComponentFixture<MatFabMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatFabMenuComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
