export interface Project {
  name: string;
  description: string;
  url?: string;
  embedUrl?: string;
  embed?: boolean;
}

export const projects: Project[] = [
  {
    name: "Track Policy",
    description: "Mapping out AI policy — a living directory of regulations worldwide.",
    url: "https://trackpolicy.org",
    embed: true,
  },
  {
    name: "PolicySim",
    description: "Simulates the US government and lets you battle them, Pokémon-style.",
    url: "https://policysim.policy.cafe",
    embed: true,
  },
  {
    name: "Corruption Map",
    description: "Visualizing corruption data across the US.",
    url: "https://corruption-map.vercel.app",
    embed: true,
  },
  {
    name: "Personal Website",
    description: "This site! Built with Next.js, Tailwind, and a little bit of magic.",
    url: "https://isabellereks.com",
    embed: true,
  },
  {
    name: "Seattle Junk Journal Club",
    description: "A creative community for junk journaling in Seattle.",
    url: "https://www.instagram.com/seattlejunkjournalclub/",
    embedUrl: "https://www.instagram.com/seattlejunkjournalclub/embed/",
    embed: true,
  },
  {
    name: "iPod Music Player",
    description: "An interactive iPod player with Spotify integration.",
    url: "https://old.isabellereks.com/ipod",
    embed: true,
  },
];
