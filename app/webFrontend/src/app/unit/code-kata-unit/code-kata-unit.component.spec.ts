import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CodeKataComponent} from './code-kata-unit.component';

describe('CodeKataComponent', () => {
  let component: CodeKataComponent;
  let fixture: ComponentFixture<CodeKataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeKataComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeKataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
