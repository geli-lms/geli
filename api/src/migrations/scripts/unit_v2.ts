// tslint:disable:no-console
import {IUnitModel, Unit} from '../../models/units/Unit';
import {ChatRoom} from '../../models/ChatRoom';

class UnitV2Migration {

  async up() {
      const _units: IUnitModel[] = await Unit.find({'chatRoom': {$exists: false}});
      return Promise.all(_units.map(async (unit: IUnitModel) => {
        const chatRoom = await ChatRoom.create({
          room: {
            roomType: 'Unit',
            roomFor: unit
          }
        });
        unit.set('chatRoom', chatRoom);
        unit.save();
      }));

    }
}

export = UnitV2Migration;
