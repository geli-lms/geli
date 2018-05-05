import {expect} from 'chai';

import Pick from '../../src/utilities/Pick';
import {IProperties} from '../../../shared/models/IProperties';

import {extractMongoId} from '../../src/utilities/ExtractMongoId';
import {Types as mongooseTypes} from 'mongoose';

import {ensureMongoToObject} from '../../src/utilities/EnsureMongoToObject';
import {DocumentToObjectOptions} from 'mongoose';
import {Course, ICourseModel} from '../../src/models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {FixtureLoader} from '../../fixtures/FixtureLoader';

const fixtureLoader = new FixtureLoader();

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

  describe('ExtractMongoId', () => {
    const idAsObjectId = mongooseTypes.ObjectId();
    const idDirect = {id: idAsObjectId.toHexString()};
    const idString = new String(idDirect.id); // tslint:disable-line
    const idExpect = idDirect.id;
    const idArray = [idAsObjectId, idDirect, {}, idAsObjectId, idString, 1, idExpect, idDirect];
    const fallback = 'fallback';

    it('should extract an id from an ObjectID object', () => {
      expect(extractMongoId(idAsObjectId)).to.eq(idExpect);
    });

    it('should extract an id from an object with "id" property', () => {
      expect(extractMongoId(idDirect)).to.eq(idExpect);
    });

    it('should return an id String object as string', () => {
      expect(extractMongoId(idString)).to.eq(idExpect);
    });

    it('should return an id string unmodified', () => {
      expect(extractMongoId(idExpect)).to.eq(idExpect);
    });

    it('should yield undefined for invalid input', () => {
      expect(extractMongoId({})).to.eq(undefined);
      expect(extractMongoId(1)).to.eq(undefined);
    });

    it('should return a specified fallback for invalid input', () => {
      expect(extractMongoId({}, fallback)).to.eq(fallback);
      expect(extractMongoId(1, fallback)).to.eq(fallback);
    });

    it('should only extract ids for valid objects in an array', () => {
      expect(extractMongoId(idArray)).to.eql([idExpect, idExpect, idExpect, idExpect, idExpect, idExpect]);
    });

    it('should extract ids for valid objects or return fallback values in an array', () => {
      expect(extractMongoId(idArray, 'fallback')).to.eql([idExpect, idExpect, fallback, idExpect, idExpect, fallback, idExpect, idExpect]);
    });
  });

  describe('EnsureMongoToObject', () => {
    // Before each test we reset the database
    beforeEach(async () => {
      await fixtureLoader.load();
    });

    it('should return the (ICourse) object without modification', async () => {
      const course: ICourse = (await Course.findOne()).toObject();
      expect(ensureMongoToObject<ICourse>(course)).to.eql(course);
    });

    it('should call the mongoose (ICourseModel) toObject function and return the result', async () => {
      const course = await Course.findOne();
      expect(ensureMongoToObject<ICourse>(course)).to.eql(course.toObject());
    });

    it('should call the mongoose (ICourseModel) toObject function with a transform option and return the result', async () => {
      const course = await Course.findOne();
      const options: DocumentToObjectOptions = {
        transform: (doc: ICourseModel, ret: any) => {
          ret._id = doc._id.toString() + '-transform-test';
        }
      };
      const expectedResult = course.toObject(options);
      expect(expectedResult._id).to.eq(course._id.toString() + '-transform-test');
      expect(ensureMongoToObject<ICourse>(course, options)).to.eql(expectedResult);
    });
  });
});
