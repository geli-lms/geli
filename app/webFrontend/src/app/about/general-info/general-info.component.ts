import {Component, OnInit} from '@angular/core';
import {Contributor} from './contributor.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ContributorsList} from './contributors';

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
    this.allContributors = ContributorsList.getAllContributors();
    // Cleanup data so can sort perfectly
    this.allContributors.forEach((value) => {
      value.firstName = value.firstName.trim();
      value.name = value.name.trim();
      value.from = value.from.replace(' ', '');
      value.githubId = value.githubId.replace(' ', '');
      value.to = value.to.replace(' ', '');
    });
    // Sort contributor
    this.allContributors.sort(Contributor.compare);
  }

  getUserAvatar(cntbr: Contributor) {
    const GH_ID = '[gh_id]';
    const style = 'background-image: url(\'https://github.com/' + GH_ID + '.png?size=100\');';

    // If the githubId is set, return bg-image otherwise empty string
    if (cntbr.githubId !== null && cntbr.githubId.length !== 0) {
      return this.sanitizer.bypassSecurityTrustStyle(
        style.replace(GH_ID, cntbr.githubId)
      );
    }
    return '';
  }

}
