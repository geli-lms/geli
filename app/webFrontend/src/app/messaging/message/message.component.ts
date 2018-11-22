import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {IMessageDisplay} from '../../../../../../shared/models/messaging/IMessage';
import {MarkdownService} from '../../shared/services/markdown.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: IMessageDisplay;
  @Input() isChildMessage = false;
  @Input() mode: string;
  htmlMessage: any;

  showReplies = false;

  constructor(private markdownService: MarkdownService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.htmlMessage = this.sanitizer.bypassSecurityTrustHtml(this.markdownService.render(this.message.content));
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }
}
