import {Component, Input, OnInit} from '@angular/core';
import {MarkdownService} from '../../services/markdown.service';
import {DomSanitizer} from '@angular/platform-browser';
import {IMessage} from '../../../../../../../shared/models/Messaging/IMessage';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: IMessage;
  @Input() isChildMessage = false;
  @Input() mode: string;

  showReplies = false;

  constructor(private markdownService: MarkdownService,   private sanitizer: DomSanitizer, private userService: UserService) { }

  ngOnInit() {
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }
}
