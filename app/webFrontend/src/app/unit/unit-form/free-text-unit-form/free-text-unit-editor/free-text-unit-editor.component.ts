import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FreeTextUnitCoreComponent} from '../../../free-text-unit/free-text-unit-core/free-text-unit-core.component';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-free-text-unit-editor',
  templateUrl: './free-text-unit-editor.component.html',
  styleUrls: ['./free-text-unit-editor.component.scss']
})
export class FreeTextUnitEditorComponent implements OnInit {

  @Input() markdown: string;

  @Input() unitForm: FormGroup;


  @ViewChild(FreeTextUnitCoreComponent)
  private freeTextCore: FreeTextUnitCoreComponent;
  @ViewChild('editor')
  private editor: AceEditorComponent;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.editor.setOptions({
      maxLines: 9999
    });
  }


  onTabChange($event: any) {
    if ($event.index === 1) {
      // We are on the preview tab
      this.freeTextCore.renderHtml();
    }
  }
}
