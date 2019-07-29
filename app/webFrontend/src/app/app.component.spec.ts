/* tslint:disable:no-unused-variable */

import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {PrivacyModule} from './privacy/privacy.module';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialImportModule} from './shared/modules/material-import.module';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationModule} from './notification/notification.module';

describe('AppComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PrivacyModule,
        MaterialImportModule,
        NotificationModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
