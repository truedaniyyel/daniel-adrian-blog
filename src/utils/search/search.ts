import FlexSearch from 'flexsearch';
import type { SearchItem } from './types';
import { SEARCH_CONSTANTS } from './consts';

let postsIndex: FlexSearch.Index | null = null;
let posts: SearchItem[] = [];

export function createPostsIndex(data: SearchItem[]) {
  postsIndex = new FlexSearch.Index({
    tokenize: 'forward',
    optimize: true,
    cache: SEARCH_CONSTANTS.CACHE_SIZE,
  });

  data.forEach((post, index) => {
    const item = `${post.title} ${post.body}`;
    postsIndex?.add(index, item);
  });

  posts = data;
}

function createSearchRegex(searchTerm: string): RegExp {
  return new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
}

function addMarkTags(text: string, regex: RegExp) {
  regex.lastIndex = 0;
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

function replaceTextWithMarker(text: string, regex: RegExp) {
  regex.lastIndex = 0;
  const hasMatch = regex.test(text);

  if (!hasMatch) return null;

  return addMarkTags(text, regex);
}

function getMatches(text: string, regex: RegExp) {
  regex.lastIndex = 0;
  const match = regex.exec(text);

  if (!match) return null;

  const { index } = match;
  const start = index - SEARCH_CONSTANTS.EXCERPT_BEFORE_MATCH;
  const end = index + SEARCH_CONSTANTS.EXCERPT_AFTER_MATCH;
  const excerpt = text.substring(start, end).trim();

  return `...${addMarkTags(excerpt, regex)}...`;
}

export function searchPostsIndex(searchTerm: string) {
  if (!postsIndex || !posts) {
    console.error(
      'Search index is not initialized. Please call `createPostsIndex` first.'
    );
    return [];
  }

  const results = postsIndex.search(searchTerm, {
    limit: SEARCH_CONSTANTS.SEARCH_RESULTS_LIMIT,
  });

  const regex = createSearchRegex(searchTerm);

  return results
    .map(index => posts[index as number])
    .map(({ path, title, body }) => {
      const highlightedTitle = replaceTextWithMarker(title, regex);
      const highlightedBody = getMatches(body, regex);

      if (!highlightedTitle && !highlightedBody) {
        return null;
      }

      return {
        path,
        title: highlightedTitle || title,
        body:
          highlightedBody ||
          body.substring(0, SEARCH_CONSTANTS.DEFAULT_SNIPPET_LENGTH).trim() +
            '...',
      };
    })
    .filter(Boolean);
}
