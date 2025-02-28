import type socialIcons from '@assets/socialIcons';

export type ThemeOption = 'light' | 'dark';

export type Site = {
  TITLE: string;
  DESCRIPTION: string;
  AUTHOR: string;
  CANONICAL_URL: string;
  LOCALE?: string; // default en
  CATEGORIES: string[];
  OG_IMAGE: string;

  TWITTER?: {
    CREATOR?: string; // twitter handle
    CARD?: 'summary' | 'summary_large_image' | 'app' | 'player';
  };

  SCHEDULED_POST_MARGIN: number;
};

export type Socials = {
  NAME: string;
  ICON: keyof typeof socialIcons;
  LABEL: string;
  HREF: string;
}[];
