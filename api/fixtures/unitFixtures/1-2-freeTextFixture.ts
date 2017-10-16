/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {FreeTextUnit} from '../../src/models/units/FreeTextUnit';

// TODO: Load this fixtures
export const freeTextFixture1u2: IFixture = {
  Model: FreeTextUnit,
  data: [
    {
      name: 'markdown 3',
      description: '...',
      markdown: '# Einleitung 2\nDies ist ein Dummytext. Er dient zum Testen.\nHier sollte kein Umbruch sein\n\nHier schon.\n## H2\nDummy text'
    },
    {
      name: 'markdown 4',
      description: '...',
      markdown: '   \n   echo "Hello World"\n   \nThis should be a code above'
    }
  ]
};
