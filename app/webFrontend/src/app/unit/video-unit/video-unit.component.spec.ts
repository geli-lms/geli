import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoUnitComponent} from './video-unit.component';

describe('VideoUnitComponent', () => {
  let component: VideoUnitComponent;
  let fixture: ComponentFixture<VideoUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoUnitComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
