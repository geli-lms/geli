import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutComponent} from './about.component';
import {GeneralInfoComponent} from './general-info/general-info.component';
import {LicensesComponent} from './licenses/licenses.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatCardModule, MatIconModule, MatListItem, MatTabsModule} from '@angular/material';
import {TitleService} from '../shared/services/title.service';
import {MaterialImportModule} from '../shared/modules/material-import.module';
import {AboutDataService} from '../shared/services/data.service';
import {BackendService} from '../shared/services/backend.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from '../shared/services/user.service';
import {ThemeService} from '../shared/services/theme.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MaterialImportModule,
        RouterTestingModule
      ],
      declarations: [
        AboutComponent,
        GeneralInfoComponent,
        LicensesComponent
      ],
      providers: [
        TitleService,
        AboutDataService,
        BackendService,
        HttpClient,
        HttpHandler,
        AuthenticationService,
        UserService,
        ThemeService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
