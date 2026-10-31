export interface Experience {
  company: string;
  role: string;
  period: string;
  start: string;
  end: string;
  mode: string;
  points: string[];
  stack: string[];
}

export const experience: Experience[] = [
  {
    company: "VISKAMNIX Technologies",
    role: "Frontend Developer Intern",
    period: "May 2026 – August 2026",
    start: "05.26",
    end: "08.26",
    mode: "Remote",
    points: [
      "Developed the Digital Census Management Portal for a Government of India census project.",
      "Built responsive Flutter applications for Android, iOS, Tablet and Web.",
      "Developed reusable UI components and dynamic multi-step survey forms.",
      "Implemented role-based workflows for Super Admin, Admin, Enumerator and Community Registration.",
      "Integrated REST APIs.",
      "Collaborated with backend developers on authentication, approval workflows and government data management.",
      "Implemented bilingual support in English and Tamil.",
    ],
    stack: ["Flutter", "Dart", "REST APIs", "Laravel", "Provider"],
  },
];

export interface Education {
  school: string;
  detail: string;
  period: string;
  location?: string;
}

export const education: Education[] = [
  {
    school: "Vellore Institute of Technology",
    location: "Chennai",
    detail: "M.Tech (Integrated) in Software Engineering",
    period: "Aug 2023 — Present",
  },
  {
    school: "Little Flower Model School",
    detail: "Higher Secondary — Mathematics & Computer Science",
    period: "2023",
  },
];

export interface Achievement {
  rank: string;
  prefix: string;
  event: string;
  scope: string;
}

export const achievements: Achievement[] = [
  { prefix: "Top", rank: "10", event: "DataQuest 2.0", scope: "National-level Hackathon" },
  { prefix: "Top", rank: "04", event: "YUVAthon", scope: "Intercollegiate Hackathon" },
];

export interface Leadership {
  title: string;
  org: string;
}

export const leadership: Leadership[] = [
  { title: "Event Management Coordinator", org: "VIT Chennai" },
  { title: "Logistics & Discipline Head", org: "Aringar Anna Thamizh Mandram" },
  { title: "Guest Care Head", org: "VIT Chennai" },
];
