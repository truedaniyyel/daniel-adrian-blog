<script lang="ts">
  import { SITE } from '@consts';
  import { SOCIALS } from '@consts';
  import uiIcons from '@assets/uiIcons';
  import socialIcons from '@assets/socialIcons';
  import { modalStore } from '@components/Modal/modalStore.svelte';
  import SearchButton from '@components/Search/SearchButton.svelte';
  import SearchModal from '@components/Search/SearchModal.svelte';
  import TagsButton from '@components/Tags/TagsButton.svelte';
  import TagsModal from '@components/Tags/TagsModal.svelte';
  import Links from '@components/Links.svelte';
  import ThemeSwitcher from '@components/ThemeSwitcher.svelte';
  import InfiniteScroll from '@components/InfiniteScroll.svelte';
  import ScrollToTop from '@components/ScrollToTop.svelte';
  import { SvelteSet, SvelteURL } from 'svelte/reactivity';
  import type { Post } from '@components/types';

  interface Props {
    posts: Post[];
  }

  let { posts }: Props = $props();

  const tags = new Set(posts.flatMap(post => post.data.tags));

  let selectedTags = $state(new SvelteSet<string>());

  const url = new SvelteURL(window.location.href);
  const urlTags = url.searchParams.get('tags');
  if (urlTags) {
    const tags = urlTags.split(',');
    selectedTags = new SvelteSet(tags.filter(tag => tags.includes(tag)));
  }

  let filteredPosts = $derived.by(() => {
    if (selectedTags.size === 0) {
      return posts;
    }

    let result = [...posts];

    if (selectedTags.size > 0) {
      result = result.filter(post =>
        post.data.tags.some(tag => selectedTags.has(tag))
      );
    }

    return result;
  });

  let isMenuOpen = $state(false);
</script>

<main inert={modalStore.activeModal !== null}>
  <header>
    <nav aria-label="Main Navigation">
      <a href="/" class="logo" title="Homepage">
        <h1>Daniel <span>Adrian</span></h1>
      </a>

      <div class="nav-link-search">
        <SearchButton />
      </div>

      <TagsButton />

      <button
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        class="nav-link menu-toggle"
        onclick={() => (isMenuOpen = !isMenuOpen)}
      >
        {@html uiIcons.menu}
      </button>

      <div
        role="navigation"
        aria-label="Site menu"
        class={['nav-links dropdown-fade', { 'menu-open': isMenuOpen }]}
      >
        <a class="nav-link" href="/blog">Blog</a>
        <a class="nav-link" href="/projects">Projects</a>

        <Links />
        <ThemeSwitcher />

        <div id="mobile-links-menu">
          <ul class="social-links">
            {#each SOCIALS as social}
              <li class="social-link">
                <a
                  href={social.HREF}
                  aria-label={social.LABEL}
                  class="social-link-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {@html socialIcons[social.ICON]}
                </a>
              </li>
            {/each}
          </ul>
          <div class="other-links">
            <a href="/sitemap-index.xml">SiteMap</a>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <InfiniteScroll posts={filteredPosts} itemsPerLoad={6} />

  <ScrollToTop />
</main>

{#if modalStore.isOpen('search')}
  <SearchModal />
{/if}

{#if modalStore.isOpen('tags')}
  <TagsModal {url} {tags} bind:selectedTags />
{/if}

<div
  onclick={() => (isMenuOpen = false)}
  aria-hidden={!isMenuOpen}
  class="modal-overlay overlay"
></div>

<style>
  .overlay {
    opacity: 0;
    visibility: hidden;
    z-index: var(--z-40);
    transition:
      opacity 0.2s ease-in-out,
      visibility 0.2s ease-in-out;
  }

  .overlay[aria-hidden='false'] {
    opacity: 1;
    visibility: visible;
  }

  header {
    position: sticky;
    top: var(--px-12);
    margin-bottom: var(--px-24);
    padding: var(--px-8);
    border-radius: var(--radius-surface);
    background-color: var(--surface-light);
    box-shadow: var(--shadow-md-light);
    z-index: var(--z-50);
  }

  :global(.dark) header {
    background-color: var(--surface-dark);
    box-shadow: var(--shadow-sm-dark);
  }

  nav {
    display: flex;
    align-items: center;
  }

  .logo {
    padding-inline: var(--px-16);
  }

  .logo h1 {
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 650;
    white-space: nowrap;
  }

  .menu-toggle {
    display: none;
  }

  .menu-toggle :global(svg) {
    width: var(--px-24);
    height: var(--px-24);
  }

  .nav-links {
    display: flex;
  }

  #mobile-links-menu {
    display: none;
    margin-block: var(--px-28) var(--px-12);
  }

  .social-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--px-16);
    margin-bottom: var(--px-16);
  }

  @media (max-width: 50rem) {
    .menu-toggle {
      display: block;
    }

    .nav-links {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: var(--px-16);
      padding: var(--px-20) var(--px-10) var(--px-8);
      border-radius: var(--radius-surface);
      background-color: var(--surface-light);
      font-size: var(--text-lg);
      font-weight: 450;
    }

    :global(.dark) .nav-links {
      background-color: var(--surface-dark);
      font-weight: 400;
    }

    .nav-links.menu-open {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .nav-link {
      text-align: center;
      padding-block: var(--px-12);
    }

    #mobile-links-menu {
      display: block;
    }
  }

  @media (max-width: 24.125rem) {
    .logo h1 span {
      display: none;
    }
  }
</style>
