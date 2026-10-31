export interface SystemSpec {
  os: string;
  version?: string;
  codename?: string;
  kernel?: string;
  type: 'primary' | 'secondary' | 'mobile';
  hardware?: string;
  de?: string;
  wm?: string;
  ds?: string;
}

export interface UserProfile {
  handle: string;
  gender: string;
  location: string;
  region: string;
  roles: string[];
}
