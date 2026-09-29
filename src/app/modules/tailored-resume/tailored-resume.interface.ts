export interface ICreateTailoredResumePayload {
  resumeId: string;
  jobId: string;
  analysisId: string;
}

export interface ITailoredResumeResponse {
  id: string;
  resumeId: string;
  jobId: string | null;
  content: unknown;
  createdAt: Date;
}
