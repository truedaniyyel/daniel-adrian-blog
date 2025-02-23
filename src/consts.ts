import type { Site, Socials } from './types';
import { minutesToMilliseconds } from './utils/minutesToMilliseconds';

const isDev = import.meta.env.DEV;

export const SITE: Site = {
  TITLE: "Daniel Adrian's blog",
  DESCRIPTION: 'Personal blog of Daniel Adrian',
  AUTHOR: 'Daniel Adrian',
  CANONICAL_URL: isDev ? 'http://localhost:4321' : 'https://truedaniyyel.com',
  LOCALE: 'en',
  CATEGORIES: ['blog', 'projects'],
  OG_IMAGE: {
    SRC: '/og-image.jpg',
    ALT: "Daniel Adrian's Blog",
  },

  TWITTER: {
    CREATOR: '@truedaniyyel',
    CARD: 'summary_large_image',
  },

  SCHEDULED_POST_MARGIN: minutesToMilliseconds(15),
};

export const SOCIALS: Socials = [
  {
    NAME: 'Facebook',
    ICON: 'facebook',
    LABEL: `${SITE.AUTHOR} on Facebook`,
    HREF: 'https://www.facebook.com/truedaniyyel',
  },
  {
    NAME: 'LinkedIn',
    ICON: 'linkedIn',
    LABEL: `${SITE.AUTHOR} on LinkedIn`,
    HREF: 'https://www.linkedin.com/in/truedaniyyel',
  },
  {
    NAME: 'Github',
    ICON: 'github',
    LABEL: `${SITE.AUTHOR} on Github`,
    HREF: 'https://www.github.com/truedaniyyel',
  },
  {
    NAME: 'RSS',
    ICON: 'rss',
    LABEL: `${SITE.AUTHOR} on RSS`,
    HREF: `${SITE.CANONICAL_URL}/rss.xml`,
  },
];
