import * as mongoose from 'mongoose';
import {ITaskUnitProgress} from '../../../shared/models/ITaskUnitProgress';
import {Progress} from './Progress';

interface ITaskUnitProgressModel extends ITaskUnitProgress, mongoose.Document {
}

const taskUnitProgressSchema = new mongoose.Schema({
}
);

const TaskUnitProgress = Progress.discriminator('taskUnit', taskUnitProgressSchema);

export {TaskUnitProgress, ITaskUnitProgressModel};
