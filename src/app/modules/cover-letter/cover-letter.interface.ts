export type CoverLetterTone = "professional" | "confident" | "enthusiastic";

export type CoverLetterLength = "short" | "medium" | "long";

export interface ICreateCoverLetterPayload {
  resumeId: string;
  jobId: string;
  tone?: CoverLetterTone;
  length?: CoverLetterLength;
}

export interface IUpdateCoverLetterPayload {
  content: string;
}

export interface ICoverLetterRecord {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCoverLetterResponse {
  coverLetter: ICoverLetterRecord;
  source: "local";
}
