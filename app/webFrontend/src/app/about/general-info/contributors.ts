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
      , new Contributor('Tobias', 'Neumann', '18SuSe', 'Student', 'Gargamil')
      , new Contributor('Armel', 'Siewe', '18SuSe', 'Student', 'armel22')
      , new Contributor('David', 'Boschmann', '18SuSe', 'Student', 'dboschm')
      , new Contributor('Daniel', 'Kesselberg', '18SuSe', 'Student', 'danielkesselberg')
      , new Contributor('Max', 'Leppla', '18SuSe', 'Student', 'mleppla')
      , new Contributor('Michael', 'Narkus', '18SuSe', 'Student', 'MichaelNarkus')
      , new Contributor('Torsten', 'Schlett', '18SuSe', 'Student', 'tross')
      , new Contributor('Clara', 'Wurm', '18SuSe', 'Student', 'wurmc')
      , new Contributor('Lukas', 'Schardt', '18SuSe', 'Student', 'lukas-schardt')
      , new Contributor('Alper', 'Uygun', '18SuSe', 'Student', 'AlperUygun')
      , new Contributor('Christoper', 'Nierobisch', '18SuSe', 'Student', 'ChrisEnpunkt')
      , new Contributor('Florian', 'Witulski', '18SuSe', 'Student', 'fwitulski')

      , new Contributor('Andreas', 'Schroll', '17WiSe', 'Student', 'AndreasSchroll', '17WiSe')
      , new Contributor('Sinisa', 'Jovanovic', '17WiSe', 'Student', 'jsinisa', '17WiSe')
      , new Contributor('Patrick', 'Skowronek', '17WiSe', 'Student', 'PatrickSkowronek')
      , new Contributor('Henrik', 'Ochs', '17WiSe', 'Student', 'HPunktOchs')
      , new Contributor('Felix', 'Brucker', '17SuSe', 'Student', 'felixbrucker', '17WiSe')

      , new Contributor('Patrick', 'Schmelmer', '17WiSe', 'Student', 'shelmz', '17WiSe')
      , new Contributor('Michael', 'Pahlke', '17WiSe', 'Student', 'micpah', '17WiSe')
      , new Contributor('Alexander', 'Eimer', '17SuSe', 'Student', 'aeimer', '17WiSe')
      , new Contributor('Steffen', 'Großpersky', '17SuSe', 'Student', 'grosspersky', '17WiSe')
      , new Contributor('Ken', 'Hasenbank', '17SuSe', 'Student', 'khase', '17WiSe')
      , new Contributor('Lukas', 'Korte', '17SuSe', 'Student', 'lukaskorte', '17WiSe')
      , new Contributor('Oliver', 'Neff', '17SuSe', 'Student', 'OliverNeff', '17WiSe')
      , new Contributor('Alexander', 'Weinfurter', '17SuSe', 'Student', 'alexweinfurter', '17WiSe')
      // Old Students
      , new Contributor('Bernd', 'Noetscher', '17SuSe', 'Student', 'bernd-hda', '17SuSe')
    ];
  }
}
