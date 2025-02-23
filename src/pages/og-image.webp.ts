import { generateOgImageForSite } from '@utils/og-images/generateOgImages';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const image = await generateOgImageForSite();

  return new Response(image, {
    headers: {
      'Content-Type': 'image/webp',
    },
  });
};
