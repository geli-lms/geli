import {Component, OnInit} from '@angular/core';
import {MarkdownService} from '../../shared/services/markdown.service';
import {ConfigService} from '../../shared/services/data.service';
import {IConfig} from '../../../../../../shared/models/IConfig';
import {MatSnackBar} from '@angular/material';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/github';

@Component({
  selector: 'app-imprint-admin',
  templateUrl: './imprint-admin.component.html',
  styleUrls: ['./imprint-admin.component.scss']
})
export class ImprintAdminComponent implements OnInit {
  imprint: IConfig;
  imprintRendered: string;
  text: string;
  constructor(private service: ConfigService,
              private mdService: MarkdownService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadImprint()
  }

  loadImprint() {
    this.service.readSingleItem('imprint').then(
      (imprint: any) => {
        this.imprint = imprint;
        this.text = this.imprint.configValue;
        this.renderHtml();
      },
      (errorResponse: Response) => {
        this.text = '';
      });
  }

  renderHtml() {
    this.imprintRendered = this.mdService.render(this.text);
  }

  onTabChange($event: any) {
    if ($event.index === 1) {
      this.renderHtml();
    }
  }
  onSave() {
    try {
      void this.service.updateItem({_id: 'imprint', data: this.text});
      this.snackBar.open('Imprint saved', '', {duration: 3000})
    } catch (error) {
      this.snackBar.open('Could not save imprint', '', {duration: 3000})
    }
    this.loadImprint();
    this.renderHtml();
  }
  onCancel() {
    this.loadImprint();
    this.renderHtml();
  }

}
