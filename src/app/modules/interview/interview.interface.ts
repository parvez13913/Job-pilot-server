export type InterviewQuestionType = "technical" | "behavioral" | "situational";

export interface IInterviewQuestion {
  id: string;
  type: InterviewQuestionType;
  question: string;
  topic: string;
}

export interface ICreateInterviewPayload {
  jobId: string;
}

export interface IUpdateInterviewPayload {
  questions: IInterviewQuestion[];
}

export interface IInterviewSessionResponse {
  id: string;
  userId: string;
  jobId: string | null;
  questions: IInterviewQuestion[];
  createdAt: Date;
}
