import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImprintComponent} from './imprint.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ImprintComponent
  ]
})
export class ImprintModule { }
