import {Contributor} from './contributor.model';

// This file contains all contributors
export class ContributorsList {
  public static getAllContributors(): Contributor[] {
    return [
      // Leader
      new Contributor('Thomas', 'Sauer', '16WiSe', 'Initiator', 'thomassss')
      , new Contributor('Ute', 'Trapp', '17SuSe', 'Lecturer', 'utetrapp')
      , new Contributor('David', 'Müller', '17SuSe', 'Lecturer', 'd89')
      // Students
      , new Contributor('Bernd', 'Noetscher', '17SuSe', 'Student', 'bernd-hda')
      , new Contributor('Felix', 'Brucker', '17SuSe', 'Student', 'felixbrucker')
      , new Contributor('Alexander', 'Eimer', '17SuSe', 'Student', 'aeimer')
      , new Contributor('Steffen', 'Großpersky', '17SuSe', 'Student', 'grosspersky')
      , new Contributor('Ken', 'Hasenbank', '17SuSe', 'Student', 'khase')
      , new Contributor('Lukas', 'Korte', '17SuSe', 'Student', 'lukaskorte')
      , new Contributor('Oliver', 'Neff', '17SuSe', 'Student', 'OliverNeff')
      , new Contributor('Alexaner', 'Weinfurter', '17SuSe', 'Student', 'alexweinfurter')
    ];
  }
}
