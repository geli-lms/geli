import { Injectable } from '@angular/core';
import {IConfig} from '../../../../../../shared/models/IConfig';
import {MarkdownService} from './markdown.service';
import {ConfigService} from './data.service';

@Injectable()
export class ImprintAndInfoService {
  constructor(private service: ConfigService,
              private mdService: MarkdownService) { }

  /**
   * @param {string} type Should be 'infoBox' to load the InfoBox Data |'legalnotice' to load the Imprint Data.
   * @returns {Promise<string>} Returns the rendered MarkdownData.
   */
  async loadConfig(type: string) {
    let configRendered = '';
    try {
      const config: IConfig = <IConfig><any> await this.service.readSingleItem('public/' + type);
      configRendered = this.renderHtml(config);
    } catch (error) {
      configRendered = '';
    }
    return configRendered;
  }

  renderHtml(config: IConfig): string {
    return this.mdService.render(config.value) || 'No Content yet!';
  }

}
