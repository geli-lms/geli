import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarkdownEditComponent } from './admin-markdown-edit.component';

describe('AdminMarkdownEditComponent', () => {
  let component: AdminMarkdownEditComponent;
  let fixture: ComponentFixture<AdminMarkdownEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMarkdownEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMarkdownEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
