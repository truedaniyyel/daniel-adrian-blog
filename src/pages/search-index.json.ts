import type { APIRoute } from 'astro';
import { posts } from '@utils/getSortedPosts';

// Markdown stripping patterns
const markdownPatterns: Record<string, RegExp> = {
  // frontmatter: /---[\s\S]*?---/g, // in astro all frontmatter is inside of .data, so it's separated from body
  code: /```.*?\n|```/gs,
  inline: /`([^`]*)`/g,
  heading: /^#{1,6}\s.*$/gm,
  link: /\[([^\]]+)\]\(([^)]+)\)/g,
  image: /\!\[.*?\]\(.*?\)/g,
  blockquote: /> /gm,
  bold: /\*\*|__/g,
  italic: /\b_([^_]+)_(?!\w)|[*]([^*]+)[*]/g,
  list: /^[-+*]\s+|^\d+\.\s+/gm,
  special: /{%.*?%}/g,
  tags: /[<>]/g,

  extraSpaces: /\s+/g,
};

function stripMarkdown(text: string): string {
  let stripped = text;

  // Process larger patterns first
  const largePatterns = ['code', 'special'];
  for (const key of largePatterns) {
    stripped = stripped.replace(markdownPatterns[key], ' ');
  }

  for (const [key, pattern] of Object.entries(markdownPatterns)) {
    if (largePatterns.includes(key)) continue;
    if (key === 'link' || key === 'italic') {
      stripped = stripped.replace(pattern, '$1');
    } else {
      stripped = stripped.replace(pattern, ' ');
    }
  }

  return stripped.replace(markdownPatterns.extraSpaces, ' ').trim();
}

export const GET: APIRoute = async () => {
  try {
    const strippedPosts = posts.map(post => ({
      path: `/${post.collection}/${post.id}`,
      title: post.data.title,
      body: stripMarkdown(post.body as string),
    }));

    const body = JSON.stringify(strippedPosts);

    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        //"Cache-Control": "public, max-age=86400", // Cache for 1 day
        ETag: `"${Buffer.from(body).length}"`,
      },
    });
  } catch (error) {
    console.error('Error generating search index:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate search index',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
