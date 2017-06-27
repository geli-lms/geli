/* tslint:disable:max-line-length */
import {IFixture} from './IFixture';
import {FreeTextUnit} from '../src/models/units/FreeTextUnit';

// TODO: Load this fixtures
export const freeTextUnitFixtures: IFixture = {
  Model: FreeTextUnit,
  data: [
    {
      markdown: '# Einleitung\nDies ist ein Dummytext. Er dient zum Testen.\nHier sollte kein Umbruch sein\n\nHier schon.\n## H2\nDummy text'
    },
    {
      markdown: '   \n   echo "Hello World"\n   \nThis should be a code above'
    }
  ]
};
