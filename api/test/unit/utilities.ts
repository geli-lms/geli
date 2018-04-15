import {expect} from 'chai';
import {IProperties} from '../../../shared/models/IProperties';
import Pick from '../../src/utilities/Pick';

describe('Testing utilities', () => {
  describe('Pick', () => {
    let input: IProperties;

    beforeEach(function() {
      input = {a: 0, b: 'b', c: [1, 2, 3], d: {e: 'f'}, e: {d: 'c'}};
    });

    it('should pick only certain attributes', () => {
      const result: IProperties = Pick.only(['a', 'c'], input);
      expect(result).to.eql({a: 0, c: [1, 2, 3]});
    });

    it('should pick certain attributes as empty containers', () => {
      const result: IProperties = Pick.asEmpty(['a', 'c', 'd'], input);
      expect(result).to.eql({c: [], d: {}});
    });
  });
});
