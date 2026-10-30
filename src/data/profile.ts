export const profile = {
  handle: "dot1245",
  roles: ["Ricer", "Vibe-Coder", "SelfHost"],
  location: "Japan",
  region: "JP / Asia-Pacific",
  timezone: "UTC +09:00",
};

export interface System {
  name: string;
  type: string;
  os: "arch" | "android";
  details: [string, string][];
}

export const systems: System[] = [
  {
    name: "Arch Linux",
    type: "Primary",
    os: "arch",
    details: [
      ["Version", "Rolling release"],
      ["Kernel", "Linux"],
      ["Display", "Wayland"],
      ["WM", "Hyprland"],
    ],
  },
  {
    name: "Android",
    type: "Mobile",
    os: "android",
    details: [
      ["Version", "16"],
      ["Device", "Pixel 10"],
      ["Storage", "128 GB"],
    ],
  },
];

export type ContactIconName = "email" | "discord" | "github" | "steam";

interface Contact {
  label: string;
  icon: ContactIconName;
  note: string;
  href: string;
}

export const contacts: Contact[] = [
  {
    label: "Email",
    icon: "email",
    note: "contact@dot1245.net",
    href: "mailto:contact@dot1245.net",
  },
  {
    label: "Discord",
    icon: "discord",
    note: "@dot.1245",
    href: "https://d.dot1245.net/",
  },
  {
    label: "GitHub",
    icon: "github",
    note: "@dot-1245",
    href: "https://github.com/dot-1245",
  },
  {
    label: "Steam",
    icon: "steam",
    note: "@dot-1245",
    href: "https://steamcommunity.com/profiles/76561199340967978/",
  },
];
