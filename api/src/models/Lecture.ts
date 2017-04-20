import * as mongoose from "mongoose";
import {ILecture} from "./ILecture";
import {Unit} from "./Unit";

interface ILectureModel extends ILecture, mongoose.Document {
}

const lectureSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Unit
      }
    ]
  },
  {
    timestamps: true,
    toObject: {
      transform: function(doc: any, ret: any) {
        ret._id = ret.id;
        delete ret.id;
      }
    }
  }
);


const Lecture = mongoose.model<ILectureModel>("Lecture", lectureSchema);

export {Lecture, ILectureModel};
