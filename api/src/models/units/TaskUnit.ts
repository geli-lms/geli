import * as mongoose from 'mongoose';
import {TaskUnit, Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
  exportJSON: () => Promise<ITaskUnit>;
  toFile: () => Promise<String>;
}

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    unitId: {
      type: String
    }
    ,
    answers: {
      type: [{
        value: Boolean,
        text: String
      }],
      required: true
    },
  }, {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        if (ret.hasOwnProperty('_id') && ret._id !== null) {
          ret._id =  ret._id.toString();
        }

        if (ret.hasOwnProperty('id') && ret.id !== null) {
          ret.id = ret.id.toString();
        }
        ret.answers = ret.answers.map((answer: any) => {
          answer._id = answer._id.toString();
          return answer;
        });
      }
    }
  }
);

const taskUnitSchema = new mongoose.Schema({
  tasks: [taskSchema],
  deadline: {
    type: String
  },
});

taskUnitSchema.statics.toFile = async function(unit: ITaskUnit) {
  let fileStream = '';

  for (const task of unit.tasks) {
    fileStream = fileStream + task.name + '\n';

    for (const answer of task.answers) {
      fileStream = fileStream + answer.text + ': [ ]\n';
    }
    fileStream = fileStream + '-------------------------------------\n';

    return new Promise((resolve) => {
      return resolve(fileStream);
    });
  }
};

// const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {taskUnitSchema, ITaskUnitModel};
