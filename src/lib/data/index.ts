export { getProjects, getFeaturedProjects, getProjectsByCategory, getProjectById, getProjectBySlug } from "./projects";
export { getProjectCategories, getProjectTags } from "./project-filters";
export { getSkills, getSkillsByCategory } from "./skills";
export { getCertifications } from "./certifications";
export { getExperiences } from "./experience";
export { getAboutSections, getAboutContent } from "./about";
export { getProfiles, getProfileByType } from "./profiles";
export {
  getExperiencePageCopy,
  getAboutPageCopy,
  getSkillsPageCopy,
  getCertificationsPageCopy,
  getProjectsPageCopy,
  getContactPageCopy,
} from "./page-copy";
export { getContactInfoData, getHomepageHero } from "./contact-info";
export type { ContactInfoData, SocialLink, HomepageHero } from "./contact-info";
export { getHomepageCards, getHomepageProjectPicks } from "./homepage";
