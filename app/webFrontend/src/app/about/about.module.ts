import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutComponent} from './about.component';
import {GeneralInfoComponent} from './general-info/general-info.component';
import {LicensesComponent} from './licenses/licenses.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {ImprintComponent} from './imprint/imprint.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    AboutComponent,
    GeneralInfoComponent,
    LicensesComponent,
    ImprintComponent,
  ]
})
export class AboutModule {
}
