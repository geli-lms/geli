export class TaskAttestation {
  _id: any;
  taskUnitId: string;
  taskId: string;
  userId: string;

  question: string;
  answers: [
    {
      _id: any;
      value: boolean,
      text: string
    }
    ];
  correctlyAnswered: boolean;

  constructor(taskId: string, userId: string, taskUnit: any, task: any, correctlyAnswered: boolean) {
    this.taskUnitId = taskUnit._id;
    this.taskId = taskId;
    this.userId = userId;
    this.question = task.question;
    this.answers = task.answers;
    this.correctlyAnswered = correctlyAnswered;

  }

}

