import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ActivationComponent} from './activation/activation.component';
import {ResetComponent} from './reset/reset.component';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ActivationComponent,
    ResetComponent,
  ]
})
export class AuthModule {
}
