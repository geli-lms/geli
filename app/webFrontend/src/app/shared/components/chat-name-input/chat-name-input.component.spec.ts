import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNameInputDialogComponent } from './chat-name-input.component';

describe('ChatNameInputDialogComponent', () => {
  let component: ChatNameInputDialogComponent;
  let fixture: ComponentFixture<ChatNameInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatNameInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNameInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
