import { IParsedJobData } from "../app/modules/analysis/analysis.interface";
import { extractSkillsFromText } from "./extract-skills-from-text";

export const getJobSkills = (job: IParsedJobData) => {
  return extractSkillsFromText([
    ...job.requiredSkills,
    ...job.preferredSkills,
    ...job.keywords,
  ]);
};
