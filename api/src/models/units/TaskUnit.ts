import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {IUser} from '../../../../shared/models/IUser';
import {IProgress} from '../../../../shared/models/progress/IProgress';
import {ITaskUnitProgress} from '../../../../shared/models/progress/ITaskUnitProgress';
import {ITask} from '../../../../shared/models/task/ITask';

interface ITaskUnitModel extends ITaskUnit, IUnitModel {
  exportJSON: () => Promise<ITaskUnit>;
  calculateProgress: (users: IUser[], progress: IProgress[]) => Promise<ITaskUnit>;
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

taskUnitSchema.methods.calculateProgress = async function (users: IUser[], progress: IProgress[]): Promise<ITaskUnit> {
  const unitObj = this.toObject();
  const progressStats: any[] = [];

  unitObj.tasks.forEach((question: ITask) => {
    const questionStats = {
      name: question.name,
      series: [{
        name: 'correct',
        value: 0
      },
      {
        name: 'wrong',
        value: 0
      },
      {
        name: 'no data',
        value: users.length
      }]
    };
    progress.forEach((userProgress: ITaskUnitProgress) => {
      let correctedAnswered = true;
      question.answers.forEach((answer) => {
        if (
          !userProgress.answers[question._id.toString()] ||
          userProgress.answers[question._id.toString()][answer._id.toString()] !== !!answer.value
        ) {
          correctedAnswered = false;
        }
      });

      if (correctedAnswered) {
        questionStats.series[0].value++;
      } else {
        questionStats.series[1].value++;
      }

      questionStats.series[2].value--;
    });

    progressStats.push(questionStats);
  });

  unitObj.progressData = progressStats;
  return unitObj;
};

taskUnitSchema.statics.toFile = async function(unit: ITaskUnit) {
  let fileStream = '';

  for (const task of unit.tasks) {
    fileStream = fileStream + task.name + '\n';

    for (const answer of task.answers) {
      fileStream = fileStream + answer.text + ': [ ]\n';
    }
    fileStream = fileStream + '-------------------------------------\n';

  }

  return new Promise((resolve) => {
    return resolve(fileStream);
  });
};

export {taskUnitSchema, ITaskUnitModel};
