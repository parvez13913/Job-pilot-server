export interface IApplicationStats {
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

export interface IDashboardResponse {
  totalResumes: number;
  totalJobs: number;
  totalApplications: number;
  totalCoverLetters: number;
  totalInterviews: number;
  totalAnalyses: number;
  averageMatchScore: number;
  applicationStats: IApplicationStats;
}