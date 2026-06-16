export interface Profile {
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  location: string;
  years_experience: number;
  summary: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: {
    start: string;
    end: string | null;
  };
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export interface SkillCategory {
  name: string;
  items: {
    name: string;
    level: 'expert' | 'advanced' | 'intermediate' | 'beginner';
    years: number;
  }[];
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  type: 'api' | 'ui' | 'cvc' | 'mobile';
  description: string;
  icon: string;
  color: string;
  technologies: string[];
  features: {
    name: string;
    description: string;
  }[];
  architecture: {
    pattern: string;
    entry_point: string;
    config: string;
  };
  stats: {
    tests_executed: string;
    coverage: string;
    frameworks_tested: number;
  };
  links: {
    github: string;
    docs: string;
  };
}

export interface ProjectStatus {
  available: boolean;
  gateway_url: string | null;
  health: string | null;
  last_run: string | null;
  runs_today: number | null;
  success_rate: number | null;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  url: string;
}

export interface Navigation {
  label: string;
  path: string;
  order: number;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    dataFiles: string;
    memory: string;
  };
}
