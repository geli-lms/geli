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
      , new Contributor('Andreas', 'Schroll', '17WiSe', 'Student', 'AndreasSchroll')
      , new Contributor('Jonas', 'Hess', '17WiSe', 'Student', 'JonasPHess')
      , new Contributor('Sinisa', 'Jovanovic', '17WiSe', 'Student', 'jsinisa')
      , new Contributor('Patrick', 'Skowronek', '17WiSe', 'Student', 'PatrickSkowronek')
      , new Contributor('Henrik', 'Ochs', '17WiSe', 'Student', 'HPunktOchs')
      , new Contributor('Patrick', 'Schmelmer', '17WiSe', 'Student', 'shelmz')
      , new Contributor('Michael', '???', '17WiSe', 'Student', 'micpah')

      , new Contributor('Felix', 'Brucker', '17SuSe', 'Student', 'felixbrucker', '17WiSe')
      , new Contributor('Alexander', 'Eimer', '17SuSe', 'Student', 'aeimer', '17WiSe')
      , new Contributor('Steffen', 'Großpersky', '17SuSe', 'Student', 'grosspersky', '17WiSe')
      , new Contributor('Ken', 'Hasenbank', '17SuSe', 'Student', 'khase', '17WiSe')
      , new Contributor('Lukas', 'Korte', '17SuSe', 'Student', 'lukaskorte', '17WiSe')
      , new Contributor('Oliver', 'Neff', '17SuSe', 'Student', 'OliverNeff', '17WiSe')
      , new Contributor('Alexaner', 'Weinfurter', '17SuSe', 'Student', 'alexweinfurter', '17WiSe')
      // Old Students
      , new Contributor('Bernd', 'Noetscher', '17SuSe', 'Student', 'bernd-hda', '17SuSe')
    ];
  }
}
