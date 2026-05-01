import rawProfile from "@/profile";

export type PersonalInfo = {
  name: string;
  profile_image?: string;
  cv_file?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  linkedin_id?: string;
  github_id?: string;
  address?: string;
  current_location?: string;
  highlight?: string;
};

export type SkillGroups = Record<string, string[]>;

export type ExperienceItem = {
  role: string;
  company: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  website?: string;
  responsibilities?: string[];
};

export type Project = {
  name: string;
  date?: string;
  type?: string;
  status?: string;
  description?: string;
  technologies?: string[];
  concepts?: string[];
  features?: string[];
  metrics?: Record<string, string> | string[];
  github?: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  location?: string;
  status?: string;
  grade?: string;
  subjects?: string[];
};

export type Publication = {
  title: string;
  description?: string;
};

export type Certification = {
  name: string;
  provider?: string;
};

export type Language = {
  language: string;
  level?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

export type Profile = {
  personal_info: PersonalInfo;
  summary: string;
  skills: SkillGroups;
  experience: ExperienceItem[];
  projects: Project[];
  education: EducationItem[];
  publications: Publication[];
  certifications: Certification[];
  languages: Language[];
  testimonials?: Testimonial[];
};

export const profile = rawProfile as Profile;

export function formatDate(value?: string) {
  if (!value) return "";

  const [year, month] = value.split("-");

  if (!year) return value;
  if (!month) return year;

  const date = new Date(Number(year), Number(month) - 1);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric"
  }).format(date);
}

export function titleFromKey(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
