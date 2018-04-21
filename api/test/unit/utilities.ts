import {expect} from 'chai';

import Pick from '../../src/utilities/Pick';
import {IProperties} from '../../../shared/models/IProperties';

import {extractId} from '../../src/utilities/ExtractId';
import {Types as mongooseTypes} from 'mongoose';

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

  describe('ExtractId', () => {
    const idAsObjectId = mongooseTypes.ObjectId();
    const idDirect = {id: idAsObjectId.toHexString()};
    const idArray = [idAsObjectId, idDirect, {}, idAsObjectId, idDirect, 1, 'id', idDirect];
    const idExpect = idDirect.id;
    const fallback = 'fallback';

    it('should extract an id from an ObjectID object', () => {
      expect(extractId(idAsObjectId)).to.eq(idExpect);
    });

    it('should extract an id from an object with "id" property', () => {
      expect(extractId(idDirect)).to.eq(idExpect);
    });

    it('should yield undefined for invalid input', () => {
      expect(extractId({})).to.eq(undefined);
      expect(extractId(1)).to.eq(undefined);
      expect(extractId('id')).to.eq(undefined);
    });

    it('should return a specified fallback for invalid input', () => {
      expect(extractId({}, fallback)).to.eq(fallback);
      expect(extractId(1, fallback)).to.eq(fallback);
      expect(extractId('id', fallback)).to.eq(fallback);
    });

    it('should only extract ids for valid objects in an array', () => {
      expect(extractId(idArray)).to.eql([idExpect, idExpect, idExpect, idExpect, idExpect]);
    });

    it('should extract ids for valid objects or return fallback values in an array', () => {
      expect(extractId(idArray, 'fallback')).to.eql([idExpect, idExpect, fallback, idExpect, idExpect, fallback, fallback, idExpect]);
    });
  });
});
