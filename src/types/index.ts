export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: {
    accent: string;
    muted: string[];
  };
  image?: string;
  imageAlt?: string;
  isPlaceholder?: boolean;
  placeholderTitle?: string;
  previewNote: string;
  githubUrl: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  label: string;
  title: string;
  institution: string;
  description?: string;
  isCurrent?: boolean;
  statusBadge?: string;
  icon: string;
  isSecondaryIcon?: boolean;
}

export interface SkillCategory {
  number: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  description: string;
  icon: string;
  ariaLabel: string;
}

export interface CanvasShaderOptions {
  canvasId: string;
  particleCountMobile?: number;
  particleCountDesktop?: number;
  colorA?: string;
  colorB?: string;
}
