import {Component, OnInit} from '@angular/core';
import {Contributor} from './contributor.model';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  allContributors: Contributor[];

  constructor() {
  }

  ngOnInit() {
    this.getAllContributors();
  }

  getAllContributors() {
    this.allContributors = [
      new Contributor('Alexander', 'Eimer', 'SuSe17', 'aeimer')
      , new Contributor('Lukas', 'Korte', 'SuSe17')
      , new Contributor('Felix', 'Brucker', 'SuSe17')
      , new Contributor('David', 'Müller', 'SuSe17', 'd89')
      , new Contributor('Ute', 'Trapp', 'SuSe17', 'ute')
      , new Contributor('Steffen', 'Großpersky', 'SuSe17')
      , new Contributor('Oliver', 'Neff', 'SuSe17')
      , new Contributor('Bernd', '???', 'SuSe17')
      , new Contributor('Alexaner', 'Weinfurter', 'SuSe17')
      , new Contributor('Ken', 'Hasenbank', 'SuSe17', 'khase')
      , new Contributor('Thomas', 'Sauer', 'SuSe17', 'thomasss')
    ].sort(Contributor.compare);
  }

  getUserAvatar(cntbr: Contributor): string {
    const GH_ID = '[gh_id]';
    let ghUrl = 'background-image: url(\'https://github.com/' + GH_ID + '.png?size=100\');';
    if (cntbr.githubId !== null && cntbr.githubId.length !== 0) {
      return ghUrl.replace(GH_ID, cntbr.githubId);
    }
    return '';
  }

}
