import {Component, Input, OnInit} from '@angular/core';
import {IConfig} from '../../../../../../../shared/models/IConfig';
import {ConfigService} from '../../../shared/services/data.service';
import {MarkdownService} from '../../../shared/services/markdown.service';
import {errorCodes} from '../../../../../../../api/src/config/errorCodes';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-configurable-pages-form',
  templateUrl: './configurable-pages-form.component.html',
  styleUrls: ['./configurable-pages-form.component.scss']
})
export class ConfigurablePagesFormComponent implements OnInit {

  config: IConfig;
  text: string;
  selectedAccessLevel: string;
  @Input() type: string;
  @Input() headingType: string;

  private additionalOptions: string[] = ['public'];

  constructor(private service: ConfigService,
              private mdService: MarkdownService,
              private snackBar: SnackBarService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.headingType = params['header'];
      this.type = params['type'];
      void this.loadConfig();
    });
  }

  async loadConfig() {
    try {
      this.config = <IConfig><any> await this.service.readSingleItem(this.type);
      this.text = this.config.value;
    } catch (error) {
      this.text = '';
    }
  }

  async onSave(markdown: string) {
    try {
      await this.service.updateItem({_id: this.type, data: markdown});
      this.snackBar.open(this.headingType + ' saved');
    } catch (err) {
      this.snackBar.open(errorCodes.save.couldNotSaveLegalnotice.text);
    }
    void this.loadConfig();
  }

  onCancel() {
    void this.loadConfig();
  }

}
