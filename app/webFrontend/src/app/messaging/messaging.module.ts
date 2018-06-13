import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MessagingComponent} from './messaging.component';
import {MessageComponent} from './message/message.component';
import {MessagingInputFieldComponent} from './messaging-input-field/messaging-input-field.component';
import {UserService} from '../shared/services/user.service';
import {MarkdownService} from '../shared/services/markdown.service';
import {ChatService} from '../shared/services/chat.service';
import {MaterialImportModule} from '../shared/modules/material-import.module';
import {CommentsDialogComponent} from './comments-dialog/comments-dialog.component';
import {EmojiSelectorComponent} from './emoji-selector/emoji-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialImportModule,
  ],
  declarations: [
    MessagingComponent,
    MessageComponent,
    MessagingInputFieldComponent,
    CommentsDialogComponent,
    EmojiSelectorComponent
  ],
  providers: [
    UserService,
    ChatService,
    MarkdownService
  ],
  exports: [
    MessagingComponent,
    MessageComponent,
    MessagingInputFieldComponent,
    CommentsDialogComponent,
    EmojiSelectorComponent
  ],
  entryComponents: [
    CommentsDialogComponent
  ],
})
export class MessagingModule { }
