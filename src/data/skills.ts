export interface SkillGroup {
  id: string;
  index: string;
  title: string;
  command: string;
  blurb: string;
  items: string[];
}

// No proficiency scores on purpose — just what I work with.
export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    index: "01",
    title: "Programming",
    command: "languages",
    blurb: "The languages I think and build in.",
    items: ["Java", "Python", "Dart", "JavaScript", "TypeScript"],
  },
  {
    id: "frameworks",
    index: "02",
    title: "Frameworks",
    command: "frameworks",
    blurb: "From cross-platform UI to server-side APIs.",
    items: [
      "Flutter",
      "React",
      "React Native",
      "Node.js",
      "NestJS",
      "REST APIs",
      "Laravel Integration",
      "Material 3",
      "Provider",
    ],
  },
  {
    id: "databases",
    index: "03",
    title: "Databases",
    command: "data",
    blurb: "Where the data lives and stays consistent.",
    items: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: "tools",
    index: "04",
    title: "Tools",
    command: "tools",
    blurb: "The everyday workbench.",
    items: ["Git", "GitHub", "VS Code", "Android Studio"],
  },
  {
    id: "concepts",
    index: "05",
    title: "Engineering",
    command: "concepts",
    blurb: "How I approach problems before writing code.",
    items: [
      "Data Structures & Algorithms",
      "Responsive UI Design",
      "Mobile App Development",
      "Requirements Analysis",
      "Agile & Scrum",
    ],
  },
];
