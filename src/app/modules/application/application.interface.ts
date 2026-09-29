import { ApplicationStatus } from "../../../generated/prisma/enums";

export interface ICreateApplicationPayload {
  jobId: string;
  status?: ApplicationStatus;
  appliedAt?: Date;
  notes?: string;
}

export interface IUpdateApplicationPayload {
  status?: ApplicationStatus;
  appliedAt?: Date | null;
  notes?: string | null;
}

export interface IApplicationJob {
  id: string;
  title: string;
  company: string | null;
}

export interface IApplicationResponse {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  job: IApplicationJob;
}
