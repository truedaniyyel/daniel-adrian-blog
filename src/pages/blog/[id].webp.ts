import { generateOgImageForPost } from '@utils/og-images/generateOgImages';
import { slugifyStr } from '@utils/slugify';
import { posts } from '@utils/getSortedPosts';
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  return posts.map(post => ({
    params: { id: slugifyStr(post.data.title) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const image = await generateOgImageForPost(props as CollectionEntry<'blog'>);

  return new Response(image, {
    headers: {
      'Content-Type': 'image.webp',
    },
  });
};
