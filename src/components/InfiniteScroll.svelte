<script lang="ts">
  import Card from '@components/Card.svelte';
  import type { Post } from '@components/types';

  interface Props {
    posts: Post[];
    itemsPerLoad: number;
  }

  let { posts, itemsPerLoad }: Props = $props();

  let displayCount = $state(itemsPerLoad);
  let totalPosts = $derived(posts.length);
  let hasMorePosts = $derived(displayCount < totalPosts);
  let visiblePosts = $derived(posts.slice(0, displayCount));
  let isLoading = $state(false);
  let sentinel: HTMLDivElement | null = $state(null);

  function createObserver() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasMorePosts && !isLoading) {
            loadMore();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }

  async function loadMore() {
    if (isLoading || !hasMorePosts) return;

    isLoading = true;
    try {
      displayCount = Math.min(displayCount + itemsPerLoad, totalPosts);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (!sentinel) return;

    createObserver();
  });
</script>

<section aria-label="List of posts">
  <ul class="cards">
    {#each visiblePosts as post (post.id)}
      <li>
        <Card {post} />
      </li>
    {/each}
  </ul>

  {#if hasMorePosts || isLoading}
    <div class="sentinel" bind:this={sentinel} aria-hidden="true">
      {#if isLoading}
        <div class="loading-spinner" aria-label="Loading more posts">
          <div class="spinner"></div>
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .cards {
    display: flex;
    flex-direction: column;
    gap: var(--px-20);
    margin-bottom: var(--px-36);
  }

  li {
    animation: fadeIn 0.3s ease-in;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sentinel {
    display: flex;
    justify-content: center;
    min-height: var(--px-100);
    padding: var(--px-24);
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--px-40);
    height: var(--px-40);
  }
</style>
