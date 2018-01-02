import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GravatarDirective} from './directives/gravatar.directive';
import {DialogModule} from './modules/dialog.module';
import {UnitMenuComponent} from './components/unit-menu/unit-menu.component';
import {UserImageDirective} from './directives/user-image.directive';
import {MaterialImportModule} from './modules/material-import.module';
import {BadgeComponent} from './components/badge/badge.component';
import {MatFabMenuComponent} from './components/mat-fab-menu/mat-fab-menu.component';
import {PasswordInputComponent} from './components/password-input/password-input.component';
import {ExpandableDivComponent} from './components/expandable-div/expandable-div.component';
import {ButtonSaveCancelComponent} from './components/button-save-cancel/button-save-cancel.component';
import {MarkdownEditorComponent} from './components/markdown-editor/markdown-editor.component';
import {AceEditorModule} from 'ng2-ace-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportModule,
    HttpClientModule,
    AceEditorModule,
  ],
  declarations: [
    GravatarDirective,
    UnitMenuComponent,
    UserImageDirective,
    BadgeComponent,
    PasswordInputComponent,
    MatFabMenuComponent,
    BadgeComponent,
    ExpandableDivComponent,
    ButtonSaveCancelComponent,
    MarkdownEditorComponent,
  ],
  exports: [
    GravatarDirective,
    DialogModule,
    UnitMenuComponent,
    UserImageDirective,
    MaterialImportModule,
    BadgeComponent,
    PasswordInputComponent,
    MatFabMenuComponent,
    BadgeComponent,
    ExpandableDivComponent,
    ButtonSaveCancelComponent,
    MarkdownEditorComponent,
  ]
})
export class SharedModule {
}
