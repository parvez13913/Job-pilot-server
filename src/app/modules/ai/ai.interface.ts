export interface IParsedResume {
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

export interface IParsedJob {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  responsibilities: string[];
  qualifications: string[];
  keywords: string[];
}
