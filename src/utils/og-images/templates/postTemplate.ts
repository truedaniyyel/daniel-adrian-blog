import satori from 'satori';
import { formatDate } from '@utils/formatDate';
import { SITE } from '@consts';
import { html } from 'satori-html';
import type { CollectionEntry } from 'astro:content';
import type { SvgConfig } from '../types';
import { DEFAULT_FONTS } from '../config';

export async function generatePostOgSvg(
  post: CollectionEntry<'blog'> | CollectionEntry<'projects'>,
  svgConfig: SvgConfig
) {
  const markup = html(`
    <div style="display: flex; align-items: center; justify-content: center; width: 1200px; height: 630px; background: linear-gradient(to bottom right, #fbc2eb, #ff6a88); position: relative; overflow: hidden; border-radius: 16px;">

      <img width="1200" height="630" src="https://raw.githubusercontent.com/truedaniyyel/daniel-adrian-blog/refs/heads/main/src/assets/content/${post.id}.png" alt="Post Cover" style="position: absolute; object-fit: cover; object-position: top; height: 100%; width: 100%;">

      <div style="position: absolute; display: flex; background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8), black); width: 1200px; height: 630px;"></div>

      <div style="display: flex; flex-direction: column; justify-content: flex-end; padding: 32px; width: 100%; height: 100%; color: white; position: relative; z-index: 2;">  

        <h1 style="font-size: 54px; font-weight: 900; line-height: 1.4;">${post.data.title}</h1>
        
        <p style="margin-top: 8px; font-size: 24px; line-height: 1.5; opacity: 0.9;">${post.data.description}</p>
  
        <div style="display: flex; align-items: center; margin-top: 16px; color: rgba(255, 255, 255, 0.75);">
          <img width="56" height="56" src="https://github.com/truedaniyyel.png"  alt="Author" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 8px;">
          <span style="font-size: 24px;">${post.data.author || SITE.AUTHOR}</span>
          <span style="margin: 0 9px; font-size: 24px;">-</span>
          <span style="font-size: 24px;">${post.data.modDatetime ? formatDate(post.data.modDatetime) : formatDate(post.data.pubDatetime)}</span>
        </div>
  
      </div>
    </div>
  `);

  return await satori(markup, {
    ...svgConfig,
    fonts: DEFAULT_FONTS,
  });
}
