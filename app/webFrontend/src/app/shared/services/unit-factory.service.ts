import { Injectable } from '@angular/core';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {FileUnit} from '../../models/units/FileUnit';
import {VideoUnit} from '../../models/units/VideoUnit';
import {CodeKataUnit} from '../../models/units/CodeKataUnit';
import {TaskUnit} from '../../models/units/TaskUnit';
import {FreeTextUnit} from '../../models/units/FreeTextUnit';


@Injectable()
export class UnitFactoryService {

  constructor() { }

  createNewUnit(type: string, course: ICourse): IUnit {
    switch (type) {
      case 'free-text' :  return new FreeTextUnit(course);
      case 'file' : return new FileUnit(course);
      case 'video' : return new VideoUnit(course);
      case 'code-kata': return new CodeKataUnit(course);
      case 'task' : return new TaskUnit(course);
    }
  }

}
