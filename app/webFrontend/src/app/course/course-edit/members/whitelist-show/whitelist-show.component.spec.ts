import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistShowComponent } from './whitelist-show.component';

describe('WhitelistShowComponent', () => {
  let component: WhitelistShowComponent;
  let fixture: ComponentFixture<WhitelistShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitelistShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitelistShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
