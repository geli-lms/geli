import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LegalnoticeComponent} from './legalnotice.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    LegalnoticeComponent
  ]
})
export class LegalnoticeModule { }
