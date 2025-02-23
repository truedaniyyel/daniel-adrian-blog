<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { formatDate } from '@utils/formatDate';
  import { readingTime } from '@utils/readingTime';
  import type { Post } from '@components/types';

  interface Props {
    post: Post;
  }

  let { post }: Props = $props();
</script>

<a
  class="card"
  href={`/${post.collection}/${post.id}`}
  aria-label={`Go to ${post.data.title} in ${post.collection}`}
>
  <div class="card-content">
    <div class="card-details">
      <time
        datetime={(
          post.data.modDatetime || post.data.pubDatetime
        ).toISOString()}
      >
        {post.data.modDatetime
          ? `Upd: ${formatDate(post.data.modDatetime)}`
          : formatDate(post.data.pubDatetime)}
      </time>
      {#if post.body}
        <span>{@html uiIcons.verticalBar}</span>
        <span>{readingTime(post.body)}</span>
      {/if}
    </div>
    <div class="card-info">
      <h2 class="card-title truncate-2">{post.data.title}</h2>
      <p class="card-text truncate-2">{post.data.description}</p>
    </div>
    <ul class="card-tags">
      {#each post.data.tags as tag}
        <li class="card-tag">
          {tag}
        </li>
      {/each}
    </ul>
  </div>

  <div class="card-media">
    {#if post.data.image}
      <img
        loading="lazy"
        decoding="async"
        src={typeof post.data.image === 'string'
          ? post.data.image
          : post.data.image.src}
        alt={post.data.title}
        class="card-img"
        onload={e => (e.target as HTMLImageElement).setAttribute('loaded', '')}
      />
    {/if}
    <div class="card-arrow">
      <span class="card-arrow-icon">
        {@html uiIcons.chevron.chevronRight}
      </span>
    </div>
  </div>
</a>

<style>
  .card {
    display: flex;
    justify-content: space-between;
    gap: var(--px-16);
    min-height: var(--h-card);
    padding-inline: var(--px-24) var(--px-12);
    padding-block: var(--px-12);
    border-radius: var(--radius-surface);
    background-color: var(--surface-light);
    box-shadow: var(--shadow-sm-light);
    transition: all var(--transition-lg);
  }

  :global(.dark) .card {
    background-color: var(--surface-dark);
  }

  .card:hover,
  .card:active {
    box-shadow: var(--shadow-lg-light);
  }

  :global(.dark) .card:hover,
  :global(.dark) .card:active {
    background-color: var(--card-dark-hover);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    padding-block: var(--px-6) var(--px-10);
  }

  .card-details {
    display: flex;
    gap: var(--px-6);
  }

  .card-info {
    margin-block: var(--px-16) auto;
    padding-bottom: var(--px-40);
  }

  .card-title {
    margin-bottom: var(--px-8);
    font-size: var(--text-xl);
    font-weight: 650;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--px-10);
    max-height: calc(2 * 2.125rem);
    overflow: hidden;
  }

  .card-tag {
    padding: var(--px-4) var(--px-12);
    border-radius: var(--radius-on-surface);
    background-color: var(--on-surface-light);
    font-size: var(--text-xs);
    text-align: center;
    line-height: 1.25rem;
    letter-spacing: 0.05em;
  }

  .card-media {
    display: flex;
    gap: var(--px-12);
  }

  .card-img {
    max-width: var(--w-card-img);
    object-fit: cover;
    border-radius: var(--radius-on-surface);
    background-color: var(--on-surface-light);
    transition: opacity var(--transition-base);
  }

  .card-img:not([loaded]) {
    background-color: var(--on-surface-light);
    opacity: 0.5;
  }

  .card-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--w-card-arrow);
    border-radius: var(--radius-on-surface);
    background-color: var(--on-surface-light);
  }

  .card-arrow-icon {
    width: var(--px-16);
  }

  :global(.dark) .card-tag,
  :global(.dark) .card-img,
  :global(.dark) .card-img:not([loaded]),
  :global(.dark) .card-arrow {
    background-color: var(--on-surface-dark);
  }

  @media (max-width: 42.188rem) {
    .card {
      flex-direction: column;
      padding: var(--px-16);
    }

    .card-content {
      padding-inline: var(--px-10);
    }

    .card-img {
      max-width: 100%;
    }

    .card-arrow {
      display: none;
    }
  }

  @media (max-width: 34.25rem) {
    .card {
      padding-inline: var(--px-12);
    }

    .card-content {
      padding: var(--px-12) var(--px-4);
    }
  }
</style>
