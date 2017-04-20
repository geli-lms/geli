import * as mongoose from "mongoose";
import {IUnit} from "./IUnit";

interface IUnitModel extends IUnit, mongoose.Document {
}

const unitSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        children: {
            type: String,
            required: true
        },
        media: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


const Unit = mongoose.model<IUnitModel>("Unit", unitSchema);

export {Unit, IUnitModel};
