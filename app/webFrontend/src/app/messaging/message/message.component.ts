import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {IMessage} from '../../../../../../shared/models/messaging/IMessage';
import {MarkdownService} from '../../shared/services/markdown.service';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: IMessage;
  @Input() isChildMessage = false;
  @Input() mode: string;
  htmlMessage: any;

  showReplies = false;

  constructor(private markdownService: MarkdownService, private sanitizer: DomSanitizer, private userService: UserService) {}

  ngOnInit() {
    this.htmlMessage = this.sanitizer.bypassSecurityTrustHtml(this.markdownService.render(this.message.content));
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }
}
