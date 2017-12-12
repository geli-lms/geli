import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeKataProgressComponent } from './code-kata-progress.component';

describe('CodeKataProgressComponent', () => {
  let component: CodeKataProgressComponent;
  let fixture: ComponentFixture<CodeKataProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeKataProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeKataProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
