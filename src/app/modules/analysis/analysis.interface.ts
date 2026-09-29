export interface ICreateAnalysisPayload {
  resumeId: string;
  jobId: string;
}

export interface IAnalysisResponse {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  matchScore: number;
  matchedSkills: unknown;
  missingSkills: unknown;
  experienceGaps: unknown;
  keywords: unknown;
  recommendations: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParsedResumeData {
  personalInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };

  summary: string | null;

  skills: string[];

  experience: {
    company: string;
    role: string;
    startDate: string | null;
    endDate: string | null;
    responsibilities: string[];
  }[];

  education: {
    institution: string;
    degree: string;
    field: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];

  certifications: string[];
}

export interface IParsedJobData {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  responsibilities: string[];
  qualifications: string[];
  keywords: string[];
}
