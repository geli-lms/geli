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
