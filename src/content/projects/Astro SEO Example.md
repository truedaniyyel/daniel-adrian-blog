---
title: 'Astro SEO Example'
pubDatetime: 2025-03-07
description: 'This project shows how to implement SEO (Search Engine Optimization) features in Astro projects.'
author: 'Daniel Adrian'
repoUrl: 'https://github.com/truedaniyyel/astro-seo-example'
tags: ['astro', 'seo']
---

## About

This project shows how to implement SEO (Search Engine Optimization) features in
Astro projects.

**Features:**

- Meta tag management
- Open Graph integration
- Automated sitemap generation
- RSS feed generation
- Robots.txt configuration
- SEO-friendly routing

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro        # Base layout with SEO components
├── pages/
│    ├── blog/
│    │   └── [id].astro         # Dynamic blog post routes
│    ├── robots.txt.ts          # Dynamic robots.txt generation
│    └── rss.xml.ts             # RSS feed generation
├── consts.ts                   # Constants including SEO configuration
└── types.ts                    # TypeScript type definitions
```

## Configuration

### Base SEO Configuration

The base SEO settings can be customized in `src/consts.ts`:

```ts title='src/config.ts'
export const SITE: Site = {
  TITLE: 'My Amazing Blog',
  DESCRIPTION: 'Welcome to my amazing blog.',
  AUTHOR: 'John Doe',
  CANONICAL_URL: import.meta.env.DEV
    ? 'http://localhost:4321'
    : 'https://johnsblog.com',
  LOCALE: 'en',
  OG_IMAGE: '/og-image.webp',

  TWITTER: {
    CREATOR: '@john_doe',
    CARD: 'summary_large_image',
  },
};
```

### Meta Tags Implementation

The `BaseLayout.astro` handles all SEO-related meta tags and structured data:

```astro title='src/layouts/BaseLayout.astro'
---
import { SITE } from '@consts';

// Google site verification code from environment variables
const googleSiteVerification = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION;

const {
  canonicalURL = new URL(Astro.url.pathname, Astro.site).href,
  title = SITE.TITLE,
  description = SITE.DESCRIPTION,
  ogImage = SITE.OG_IMAGE,
  author = SITE.AUTHOR,
  pubDatetime,
  modDatetime,
} = Astro.props;

// Construct the full URL for social media images
// Falls back to og-image.webp if no custom image is provided
const socialImageURL = new URL(
  ogImage ?? SITE.OG_IMAGE ?? 'og-image.webp',
  Astro.url.origin
).href;

// Schema.org structured data for blog posts
// This helps search engines better understand the content
// If you need another type of schema, you can read https://schema.org/docs/documents.html.
const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: `${title}`,
  image: `${socialImageURL}`,
  ...(pubDatetime && {
    datePublished: new Date(pubDatetime).toISOString(),
  }),
  ...(modDatetime && { dateModified: modDatetime.toISOString() }),
  author: [
    {
      '@type': 'Person',
      name: `${author}`,
      url: `${canonicalURL}`,
    },
  ],
};
---

<!doctype html>
<html lang=`${SITE.LOCALE ?? "en"}`>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />
    <meta name="generator" content={Astro.generator} />

    <!-- General Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="author" content={author} />
    <link rel="sitemap" href="/sitemap-index.xml" />

    <!-- Open Graph / Facebook -->
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={socialImageURL} />

    <!-- Twitter -->
    <meta property="twitter:card" content={SITE.TWITTER?.CARD} />
    <meta property="twitter:url" content={canonicalURL} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={socialImageURL} />

    <!-- Google JSON-LD Structured data -->
    <script type="application/ld+json" set:html={JSON.stringify(schemaData)} />

    {
      // If PUBLIC_GOOGLE_SITE_VERIFICATION is set in the environment variable,
      // include google-site-verification tag in the heading
      // Learn more: https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag
      googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      )
    }
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Dynamic Routes SEO

For dynamic routes like blog posts, implement SEO data in
`src/pages/blog/[id].astro`:

```astro title='src/pages/blog/[id].astro'
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { posts } from '@utils/getSortedPosts';

export async function getStaticPaths() {
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;

const ogUrl = `/${post.collection}/${post.id}.webp`;

const Props = {
  canonicalURL: post.data.canonicalURL,
  title: post.data.title,
  ogImage: ogUrl,
  author: post.data.author,
  pubDatetime: post.data.pubDatetime,
  modDatetime: post.data.modDatetime,
};
---

<BaseLayout {...Props} />
```

### Robots and Sitemap Generation

Automatically generate a `robots.txt` file with `sitemap.xml`.  
(You can check the sitemap only after running `pnpm build`, then preview it with
`pnpm preview`.)

For more info, see
[Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/):

```ts title='src/robots.txt'
import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
```

### RSS

Generate `rss.xml.ts` for search engines.  
For more info, see [Astro RSS](https://docs.astro.build/en/recipes/rss/):

```ts title='src/rss.xml.ts'
import rss from '@astrojs/rss';
import { SITE } from '@consts';
import { posts } from '@utils/getSortedPosts';

type Context = {
  site: string;
};

export async function GET(context: Context) {
  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: posts.map(({ data, id, collection }) => ({
      link: `/${collection}/${id}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      author: data.author || SITE.AUTHOR,
      enclosure: {
        url: new URL(`/${collection}/${id}.webp`, context.site).href,
        type: 'image/webp',
        length: 0,
      },
    })),
  });
}
```

## Usage

1. Clone this repository
2. Install dependencies: `pnpm install`
3. Update SEO configuration in `src/consts.ts`
4. Customize meta components as needed
5. Run `pnpm dev` to start development server
6. Run `pnpm build` to generate your SEO-optimized site
