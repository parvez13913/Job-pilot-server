export interface ICreateResumePayload {
  name: string;
  fileUrl?: string;
  rawText?: string;
}

export interface IUpdateResumePayload {
  name?: string;
}

export interface IResumeResponse {
  id: string;
  userId: string;
  name: string;
  fileUrl: string | null;
  rawText: string | null;
  parsedData: unknown;
  createdAt: Date;
  updatedAt: Date;
}
