import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FreeTextUnitCoreComponent} from '../../../free-text-unit/free-text-unit-core/free-text-unit-core.component';

@Component({
  selector: 'app-free-text-unit-editor',
  templateUrl: './free-text-unit-editor.component.html',
  styleUrls: ['./free-text-unit-editor.component.scss']
})
export class FreeTextUnitEditorComponent implements OnInit {
  @Input() markdown: string;

  @ViewChild(FreeTextUnitCoreComponent)
  private freeTextCore: FreeTextUnitCoreComponent;

  constructor() { }

  ngOnInit() {
  }

  onTabChange($event: any) {
    if ($event.index === 1) {
      // We are on the preview tab
      this.freeTextCore.renderHtml();
    }
  }
}
