import {Component, OnInit} from '@angular/core';
import {Contributor} from './contributor.model';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  allContributors: Contributor[];

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getAllContributors();
  }

  getAllContributors() {
    this.allContributors = [
      new Contributor('Alexander', 'Eimer', '17SuSe', 'Student', 'aeimer')
      , new Contributor('Lukas', 'Korte', '17SuSe', 'Student')
      , new Contributor('Felix', 'Brucker', '17SuSe', 'Student')
      , new Contributor('David', 'Müller', '17SuSe', 'Lecturer', 'd89')
      , new Contributor('Ute', 'Trapp', '17SuSe', 'Lecturer', 'utetrapp')
      , new Contributor('Steffen', 'Großpersky', '17SuSe', 'Student')
      , new Contributor('Oliver', 'Neff', '17SuSe', 'Student')
      , new Contributor('Bernd', '???', '17SuSe', 'Student')
      , new Contributor('Alexaner', 'Weinfurter', '17SuSe', 'Student')
      , new Contributor('Ken', 'Hasenbank', '17SuSe', 'Student', 'khase')
      , new Contributor('Thomas', 'Sauer', '16WiSe', 'Initiator', 'thomassss')
    ];
    this.allContributors.forEach((value, index, array) => {
      value.firstName = value.firstName.trim();
      value.name = value.name.trim();
      value.from = value.from.replace(' ', '');
      value.githubId = value.githubId.replace(' ', '');
      value.to = value.to.replace(' ', '');
    });
    this.allContributors.sort(Contributor.compare);
  }

  getUserAvatar(cntbr: Contributor) {
    const GH_ID = '[gh_id]';
    let style = 'background-image: url(\'https://github.com/' + GH_ID + '.png?size=100\');';

    // If the githubId is set, return bg-image otherwise empty string
    if (cntbr.githubId !== null && cntbr.githubId.length !== 0) {
      return this.sanitizer.bypassSecurityTrustStyle(
        style.replace(GH_ID, cntbr.githubId)
      );
    }
    return '';
  }

}
