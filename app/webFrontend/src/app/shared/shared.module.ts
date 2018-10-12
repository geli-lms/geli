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
import {FileUploadModule} from 'ng2-file-upload';
import {ChangePasswordDialogComponent} from './components/change-password-dialog/change-password-dialog.component';
import {MarkdownEditorComponent} from './components/markdown-editor/markdown-editor.component';
import {AceEditorModule} from 'ng2-ace-editor';
import {PickMediaDialog} from './components/pick-media-dialog/pick-media-dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import {AdminMarkdownEditComponent} from './components/admin-markdown-edit/admin-markdown-edit.component';
import {UserProfileDialog} from 'app/shared/components/user-profile-dialog/user-profile-dialog.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import { ShowCommentsDirective } from './directives/show-comments.directive';

import {ResponsiveImageComponent} from './components/responsive-image/responsive-image.component';
import { headersToString } from 'selenium-webdriver/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportModule,
    HttpClientModule,
    FileUploadModule,
    AceEditorModule,
    FileUploadModule,
    TranslateModule,
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
    ChangePasswordDialogComponent,
    MarkdownEditorComponent,
    PickMediaDialog,
    AdminMarkdownEditComponent,
    UserProfileDialog,
    NotfoundComponent,
    UserProfileDialog,
    ShowCommentsDirective,
    ResponsiveImageComponent
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
    ChangePasswordDialogComponent,
    PickMediaDialog,
    TranslateModule,
    AdminMarkdownEditComponent,
    UserProfileDialog,
    ShowCommentsDirective,
    ResponsiveImageComponent
  ],
  entryComponents: [
    PickMediaDialog,
    UserProfileDialog,
  ],
})
export class SharedModule {
}
