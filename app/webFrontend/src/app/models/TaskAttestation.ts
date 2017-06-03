
export class TaskAttestation {
  _id: any;
  taskId: string;

  // attestations: [
  // {
  // _id: any;
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
  // }
  // ];

  constructor(taskId: string, userId: string, task: any, correctlyAnswered: boolean) {
    this.taskId = taskId;
    this.userId = userId;
    this.question = task.name;
    this.answers = task.answers;
    this.correctlyAnswered = correctlyAnswered;


// const attestation = { _id: -1, studentId: userId, question: task.name, answers: task.answers, correctlyAnswered: correctlyAnswered } ;
    // delete attestation._id; // TODO WORKAROUND get rid of the _id for the answers
    // this.attestations = [(attestation)];

  }


}

