export interface ICreateJobPayload {
  title: string;
  company?: string;
  description: string;
}

export interface IUpdateJobPayload {
  title?: string;
  company?: string;
  description?: string;
}

export interface IJobResponse {
  id: string;
  userId: string;
  title: string;
  company: string | null;
  description: string;
  parsedData: unknown;
  createdAt: Date;
}
