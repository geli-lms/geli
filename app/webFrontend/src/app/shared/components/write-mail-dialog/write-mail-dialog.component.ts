import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MarkdownService} from '../../services/markdown.service';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import {AceEditorComponent} from 'ng2-ace-editor';

@Component({
  selector: 'app-write-mail-dialog',
  templateUrl: './write-mail-dialog.component.html',
  styleUrls: ['./write-mail-dialog.component.scss']
})
export class WriteMailDialog implements OnInit {

  @Input() bcc: string;
  @Input() cc: string;
  @Input() subject: string;
  @Input() markdown: string;

  @ViewChild('editor') editor: AceEditorComponent;
  renderedHtml: string;

  constructor(
    public dialogRef: MatDialogRef<WriteMailDialog>,
    private mdService: MarkdownService
  ) {}

  ngOnInit() {
    this.renderedHtml = this.mdService.render(this.markdown);
  }

  ngAfterViewInit(): void {
    this.editor.getEditor().navigateFileStart();
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  public sendMail() {
    this.dialogRef.close({
      bcc: this.bcc,
      cc: this.cc,
      subject: this.subject,
      markdown: this.markdown,
    });
  }

  onTabChange(event: any) {
    if (event.index === 1) {
      // We are on the preview tab
      this.renderedHtml = this.mdService.render(this.markdown);
    } else {
      this.editor.getEditor().focus();
    }
  }
}
