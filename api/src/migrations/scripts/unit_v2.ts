// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel, Unit} from '../../models/units/Unit';
import {ChatRoom} from '../../models/ChatRoom';
import {ObjectID} from 'bson';

class UnitV2Migration {

  async up() {
    console.log('Unit V2 up was called');
    try {
      const units: IUnitModel[] = await Unit.find({'chatRoom': {$exists: false}});
      const unitsWithChat = await Promise.all(units.map(async (unit: IUnitModel) => {
        const unitObj = unit.toObject();
        const chatRoom = await ChatRoom.create({
          room: {
            roomType: 'Unit',
            roomFor: unit._id
          }
        });
        const chatRoomObj = chatRoom.toObject();

        unitObj.chatRoom = chatRoomObj._id;
        unitObj._id  = new ObjectID(unitObj._id);

        const unitAfterReplace = await mongoose.connection.collection('units')
          .findOneAndReplace({'_id': unit._id}, unitObj);
      }));
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('Chat rooms have been successfully added to units!');
    return true;
  }
}

export = UnitV2Migration;
