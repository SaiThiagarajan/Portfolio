// All personal content lives here. Edit freely — nothing else needs to change.

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  role: string;
  tagline: string;
  intro: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  lookingFor: string;
  socials: SocialLink[];
  about: string[];
  aboutStatement: string;
}

export const profile: Profile = {
  firstName: "Sai",
  lastName: "Thiagarajan",
  fullName: "Sai Thiagarajan A",
  initials: "ST",
  role: "Software Engineer",
  tagline: "Building digital experiences.",
  intro:
    "I build scalable applications, intuitive interfaces and intelligent digital experiences through modern software engineering.",
  location: "Chennai, India",
  email: "sairamtvl2006@gmail.com",
  phone: "+91 88387 56464",
  phoneHref: "tel:+918838756464",
  // From the resume: "Seeking an entry-level Full Stack Developer or Software Engineering role."
  lookingFor: "Open to entry-level Full Stack & Software Engineering roles",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sai-thiagarajan-a-a90104293",
      handle: "in/sai-thiagarajan-a",
    },
    {
      label: "GitHub",
      href: "https://github.com/SaiThiagarajan15349",
      handle: "SaiThiagarajan15349",
    },
  ],
  about: [
    "I'm Sai Thiagarajan A, a Software Engineering student at Vellore Institute of Technology, Chennai, passionate about building practical, scalable and user-focused software solutions.",
    "My interests span full-stack development, cross-platform application engineering, backend systems and AI-powered applications.",
    "I enjoy transforming complex problems into clean, reliable and intuitive digital experiences.",
  ],
  aboutStatement: "Clean code. Clear thinking. Real problems.",
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
