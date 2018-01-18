import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MarkdownService} from '../../services/markdown.service';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownEditorComponent implements OnInit {
  @Input() markdown: string;
  @Output()
  save: EventEmitter<any> = new EventEmitter();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter();

  renderedHtml = '';
  constructor(private mdService: MarkdownService) { }

  ngOnInit() {
    this.markdown = this.markdown || '';
    this.renderHTML();
  }
  renderHTML() {
    this.renderedHtml = this.mdService.render(this.markdown);
  }
  onTabChange($event: any) {
    if ($event.index === 1) {
      this.renderHTML();
    }
  }
  emitSave(): void {
    this.save.emit(this.markdown);
  }
  emitCancel(): void {
    this.cancel.emit(null);
  }

}
