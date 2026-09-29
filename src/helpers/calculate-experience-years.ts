import { IParsedResumeData } from "../app/modules/analysis/analysis.interface";

const getMonthsDifference = (
  startDate: string,
  endDate: string | null,
): number => {
  const start = new Date(startDate);

  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const end = endDate ? new Date(endDate) : new Date();

  if (Number.isNaN(end.getTime())) {
    return 0;
  }

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(months, 0);
};

export const calculateExperienceYears = (resume: IParsedResumeData): number => {
  const months = resume.experience.reduce((total, item) => {
    if (!item.startDate) {
      return total;
    }

    return total + getMonthsDifference(item.startDate, item.endDate);
  }, 0);

  return Number((months / 12).toFixed(1));
};
