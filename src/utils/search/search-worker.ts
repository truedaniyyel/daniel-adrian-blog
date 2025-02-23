import { createPostsIndex, searchPostsIndex } from './search';

addEventListener('message', async event => {
  const { type, payload } = event.data;

  if (type === 'load') {
    const response = await fetch('/search-index.json');

    if (!response.ok) {
      throw new Error(
        `Failed to load search index: ${response.status} ${response.statusText}`
      );
    }

    const posts = await response.json();

    createPostsIndex(posts);
    postMessage({ type: 'ready' });
  }

  if (type === 'search') {
    const { searchTerm } = payload;
    const results = searchPostsIndex(searchTerm);
    postMessage({ type: 'results', payload: { results, searchTerm } });
  }
});
