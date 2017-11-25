import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WhitelistEditComponent} from './whitelist-edit.component';

describe('WhitelistEditComponent', () => {
  let component: WhitelistEditComponent;
  let fixture: ComponentFixture<WhitelistEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhitelistEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitelistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
