import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FileRoutingModule} from './file-routing.module';
import {FileComponent} from './file.component';

@NgModule({
  imports: [
    CommonModule,
    FileRoutingModule
  ],
  declarations: [FileComponent]
})
export class FileModule { }
