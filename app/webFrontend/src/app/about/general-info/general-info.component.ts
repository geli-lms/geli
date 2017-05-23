import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  allContributors: Contributor[];

  constructor() { }

  ngOnInit() {
    this.getAllContributors();
  }

  getAllContributors() {
    this.allContributors = [
      new Contributor('Alexander', 'Eimer', 'SuSe17', 'aeimer')
      , new Contributor('Lukas', 'Korte', 'SuSe17')
      , new Contributor('Felix', 'Brucker', 'SuSe17')
      , new Contributor('David', 'Müller', 'SuSe17')
      , new Contributor('Ute', 'Trapp', 'SuSe17')
      , new Contributor('Steffen', 'Großpersky', 'SuSe17')
      , new Contributor('Oliver', 'Neff', 'SuSe17')
      , new Contributor('Bernd', '???', 'SuSe17')
      , new Contributor('Alexaner', 'Weinfurter', 'SuSe17')
      , new Contributor('Ken', 'Hasenbank', 'SuSe17')
    ].sort(Contributor.compare);
  }

}

export class Contributor {
  firstName: string;
  name: string;
  from: string;
  to: string;
  githubId: string;

  constructor(firstName: string, name: string, from: string, githubId: string = '', to: string = 'present') {
    this.firstName = firstName;
    this.name = name;
    this.from = from;
    this.githubId = githubId;
    this.to = to;
  }

  // To be able to sort eg an array
  public static compare(a: Contributor, b: Contributor): number {
    let compare;

    // Check for FROM
    compare = a.from.localeCompare(b.from);
    if (compare !== 0) {
      return compare;
    }

    // Check for NAME
    compare = a.name.localeCompare(b.name);
    if (compare !== 0) {
      return compare;
    }

    // Check for FIRST_NAME
    compare = a.firstName.localeCompare(b.firstName);

    return compare;
  }
}
