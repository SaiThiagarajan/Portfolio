export type VisualKind = "census" | "cityfix" | "ownit" | "useit";

export interface FeatureGroup {
  label: string;
  status: "built" | "planned";
  points: string[];
}

export interface Project {
  id: string;
  number: string;
  name: string;
  fullName: string;
  category: string;
  summary: string;
  stack: string[];
  stackNote?: string;
  features: FeatureGroup[];
  visual: VisualKind;
  /** Only real URLs. Leave undefined until one exists. */
  repo?: string;
  demo?: string;
  /** Shown when details are still being written. */
  pendingNote?: string;
}

export const projects: Project[] = [
  {
    id: "dcmp",
    number: "01",
    name: "DCMP",
    fullName: "Digital Census Management Portal",
    category: "Cross-platform application",
    summary:
      "A cross-platform Census Management application for a Government of India census project, built with Flutter and Dart.",
    stack: ["Flutter", "Dart", "REST APIs", "Laravel Integration", "Provider", "SharedPreferences"],
    features: [
      {
        label: "Key contributions",
        status: "built",
        points: [
          "Built responsive applications for Android, iOS, tablets and Web.",
          "Implemented reusable UI components and Material 3 design principles.",
          "Integrated REST APIs with token-based authentication.",
          "Developed role-based workflows for Enumerator, Admin and Super Admin.",
          "Implemented citizen record management and dynamic survey workflows.",
          "Supported bilingual interfaces in English and Tamil.",
        ],
      },
    ],
    visual: "census",
  },
  {
    id: "cityfix",
    number: "02",
    name: "City Fix",
    fullName: "An Urban Issue Raiser, Tracking, and Resolution System",
    category: "Full stack application",
    summary:
      "A citizen reporting platform that lets people report urban issues with photographs and geolocation, then track them through to resolution.",
    stack: [
      "React Native / Flutter",
      "React.js / Next.js",
      "Node.js",
      "Express / Django",
      "MongoDB / PostgreSQL / MySQL",
      "Prometheus",
      "Grafana",
    ],
    stackNote:
      "Technologies listed in the resume. Slashes mark alternatives explored — not every option ran together in one deployment.",
    features: [
      {
        label: "Key contributions",
        status: "built",
        points: [
          "Built citizen reporting workflows.",
          "Developed interfaces for issue tracking and administration.",
          "Integrated backend services for issue lifecycle management.",
          "Worked on a chaos engineering framework.",
          "Built real-time observability dashboards using Prometheus and Grafana.",
          "Simulated failures and automated rollback pipelines to improve recovery workflows.",
        ],
      },
    ],
    visual: "cityfix",
    repo: "https://github.com/naveenvit/City_Fix",
  },
  {
    id: "ownit",
    number: "03",
    name: "OWNIT",
    fullName: "Smart Lost & Found Management Platform",
    category: "Full stack / smart application",
    summary:
      "A cross-platform Lost & Found application in Flutter — report lost and found items, browse reports, view history and search records, backed by a NestJS API.",
    stack: [
      "Flutter",
      "Dart",
      "NestJS",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "TypeORM",
      "Vector DB · planned",
    ],
    features: [
      {
        label: "What I built",
        status: "built",
        points: [
          "Developed the Flutter cross-platform application.",
          "Built RESTful APIs using NestJS and Node.js.",
          "Integrated PostgreSQL with TypeORM for persistent storage.",
          "Implemented backend-driven Home, History and Search features.",
          "Replaced mock data with real-time API-fetched records.",
          "Designed a scalable foundation for intelligent item matching.",
        ],
      },
      {
        label: "Planned — not yet built",
        status: "planned",
        points: [
          "AI-powered item matching using vector embeddings.",
          "Vector similarity search to surface potential matches between lost and found reports.",
        ],
      },
    ],
    visual: "ownit",
  },
  {
    id: "useit",
    number: "04",
    name: "UseIt",
    fullName: "AI-Powered Application",
    category: "AI / cross-platform application",
    summary:
      "A Flutter-based AI project focused on building an intelligent, user-friendly application experience.",
    stack: ["Flutter", "Dart", "AI integration"],
    features: [
      {
        label: "Overview",
        status: "built",
        points: ["Flutter cross-platform client with AI integration at its core."],
      },
    ],
    pendingNote: "Full case study coming soon.",
    visual: "useit",
  },
];
