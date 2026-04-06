export interface Project {
  name: string;
  description: string;
  url?: string;
}

export const projects: Project[] = [
  {
    name: "Personal Website",
    description: "This site! Built with Next.js, Tailwind, and a little bit of magic.",
  },
  {
    name: "Seattle Junk Journal Club",
    description: "A creative community for junk journaling in Seattle.",
    url: "https://www.instagram.com/seattlejunkjournalclub/",
  },
  {
    name: "iPod Music Player",
    description: "An interactive iPod player with Spotify integration.",
  },
  {
    name: "AAYLC Booklet",
    description: "Designed the 2024 and 2025 booklets for the Asian American Youth Leadership Conference.",
    url: "https://aaylc.org",
  },
];
