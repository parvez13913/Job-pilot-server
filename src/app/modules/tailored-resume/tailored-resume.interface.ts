export interface ICreateTailoredResumePayload {
  resumeId: string;
  jobId: string;
  analysisId: string;
}

export interface ITailoredResumeVersion {
  id: string;
  resumeId: string;
  jobId: string | null;
  content: unknown;
  createdAt: Date;
}

export interface ITailoredResumeResponse {
  version: ITailoredResumeVersion;
  content: unknown;
  source: "local";
}
