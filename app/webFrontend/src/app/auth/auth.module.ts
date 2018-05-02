import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ActivationComponent} from './activation/activation.component';
import {ActivationResendComponent} from './activation-resend/activation-resend.component';
import {ResetComponent} from './reset/reset.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ActivationComponent,
    ResetComponent,
    ActivationResendComponent,
  ]
})
export class AuthModule {
}
