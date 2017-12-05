import {CodeKataProgress} from '../models/CodeKataProgress';
import {Progress} from '../models/Progress';
import {InternalServerError} from 'routing-controllers';
import {IUnit} from '../../../shared/models/units/IUnit';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {FileUnit} from '../models/units/FileUnit';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {VideoUnit} from '../models/units/VideoUnit';

export class UnitClassMapper {

  private static classMappings: any = {
    'free-text' :
      {
        mongooseClass: FreeTextUnit,
        progressClass: null,
      },
    'file' :
      {
        mongooseClass: FileUnit,
        progressClass: null,
      },
    'video' :
      {
        mongooseClass: VideoUnit,
        progressClass: null,
      },
    'code-kata' :
      {
        mongooseClass: CodeKataUnit,
        progressClass: CodeKataProgress,
      },
    'task' :
      {
        mongooseClass: TaskUnit,
        progressClass: Progress,
      },
  };

  private static getClassMappingForUnit(unit: IUnit): any {
    const hasNoProgressClass = Object.keys(this.classMappings).indexOf(unit.unitType) === -1 ;
    if (hasNoProgressClass) {
      throw new InternalServerError(`No classmapping for type ${unit.unitType} available`);
    }

    return this.classMappings[unit.unitType];
  }

  public static getMongooseClassForUnit(unit: IUnit) {
    const classMapping = this.getClassMappingForUnit(unit);

    return classMapping.mongooseClass;
  }

  public static getProgressClassForUnit(unit: IUnit) {
    const classMapping = this.getClassMappingForUnit(unit);
    if (!classMapping || classMapping.progressClass === null) {
      throw new InternalServerError(`No progress class for type ${unit.unitType} available`);
    }

    return classMapping.progressClass;
  }

}
