/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {FileViewComponent} from './file-view.component';

describe('FileViewComponent', () => {
  let component: FileViewComponent;
  let fixture: ComponentFixture<FileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
