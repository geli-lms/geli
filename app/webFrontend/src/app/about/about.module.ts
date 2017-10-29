import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {AboutComponent} from './about.component';
import {GeneralInfoComponent} from './general-info/general-info.component';
import {LicensesComponent} from './licenses/licenses.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    AboutComponent,
    GeneralInfoComponent,
    LicensesComponent,
  ]
})
export class AboutModule {
}
