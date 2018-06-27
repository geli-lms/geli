import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTreeComponent } from './download-tree.component';

describe('DownloadTreeComponent', () => {
  let component: DownloadTreeComponent;
  let fixture: ComponentFixture<DownloadTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
