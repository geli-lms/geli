import * as mongoose from 'mongoose';
import {ITaskAttestation} from '../../../shared/models/ITaskAttestation';

interface ITaskAttestationModel extends ITaskAttestation, mongoose.Document {
}

const taskAttestationSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    question: {
      type: String
    },
    answers: [
      {
        value: Boolean,
        text: String
      }
    ],
    correctlyAnswered: Boolean
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = doc.id;
      }
    }
  }
);


const TaskAttestation = mongoose.model<ITaskAttestationModel>('TaskAttestation', taskAttestationSchema);

export {TaskAttestation, ITaskAttestationModel};
