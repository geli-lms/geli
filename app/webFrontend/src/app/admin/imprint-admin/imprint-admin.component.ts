import {Component, OnInit} from '@angular/core';
import {MarkdownService} from '../../shared/services/markdown.service';
import {ConfigService} from '../../shared/services/data.service';
import {IConfig} from '../../../../../../shared/models/IConfig';
import {MatSnackBar} from '@angular/material';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';

@Component({
  selector: 'app-imprint-admin',
  templateUrl: './imprint-admin.component.html',
  styleUrls: ['./imprint-admin.component.scss']
})
export class ImprintAdminComponent implements OnInit {
  imprint: IConfig;
  text: string;
  constructor(private service: ConfigService,
              private mdService: MarkdownService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    void this.loadImprint();
  }

  async loadImprint() {
    try {
      this.imprint = <IConfig><any> await this.service.readSingleItem('imprint');
      this.text = this.imprint.value;
    } catch (error) {
      this.text = '';
    }
  }
  onSave(markdown: string ) {
    try {
      void this.service.updateItem({_id: 'imprint', data: markdown});
      this.snackBar.open('Imprint saved', '', {duration: 3000});
    } catch (error) {
      this.snackBar.open(errorCodes.save.couldNotSaveImprint.text, '', {duration: 3000});
    }
    void this.loadImprint();
  }
  onCancel() {
    void this.loadImprint();
  }

}
