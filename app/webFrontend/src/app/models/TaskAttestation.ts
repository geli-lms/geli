export class TaskAttestation {
  _id: any;
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


  constructor(taskId: string, userId: string, task: any, correctlyAnswered: boolean) {
    this.taskId = taskId;
    this.userId = userId;
    this.question = task.question;
    this.answers = task.answers;
    this.correctlyAnswered = correctlyAnswered;

  }


}

