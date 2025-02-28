<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { fade } from 'svelte/transition';
  import type { MarkdownHeading } from 'astro';

  interface Props {
    headings: MarkdownHeading[];
  }

  let { headings }: Props = $props();
  let isTocOpen = $state(false);

  const postEl = document.querySelector('.post');

  function toggleToc() {
    isTocOpen = !isTocOpen;

    if (isTocOpen) {
      document.documentElement.style.overflow = 'hidden';
      postEl?.setAttribute('inert', '');
    } else {
      document.documentElement.removeAttribute('style');
      postEl?.removeAttribute('inert');
    }
  }

  function closeToc() {
    isTocOpen = false;
    document.documentElement.removeAttribute('style');
    postEl?.removeAttribute('inert');
  }

  function handleEscape(e: KeyboardEvent) {
    if (!isTocOpen || e.code !== 'Escape') return;
    e.preventDefault();
    closeToc();
  }
</script>

<svelte:window onkeydown={handleEscape} />

{#if isTocOpen}
  <div
    class="modal-overlay"
    onclick={closeToc}
    aria-hidden={!isTocOpen}
    transition:fade={{
      duration: 200,
    }}
  ></div>
{/if}

<div class={['toc-wrapper', { open: isTocOpen }]}>
  <button
    class="btn toc-toggle"
    onclick={toggleToc}
    aria-expanded={isTocOpen}
    aria-controls="toc"
  >
    <span class="toggle-text">Table of Contents</span>
    <span class="toggle-icon">
      {@html isTocOpen ? uiIcons.minus : uiIcons.plus}
    </span>
  </button>

  <nav id="toc" class="dropdown-fade">
    <ul class="toc-list toc-max-h">
      {#each headings as heading}
        <li class="toc-item">
          <a
            onclick={toggleToc}
            class="item-link truncate-2"
            href="#{heading.slug}">{heading.text}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .toc-wrapper {
    position: relative;
    width: 100%;
    z-index: var(--z-max);
    will-change: transform;
  }

  .toc-toggle,
  #toc {
    background-color: var(--on-surface-light);
    border-radius: var(--radius-surface);
  }

  :global(.dark) .toc-toggle,
  :global(.dark) #toc {
    background-color: var(--on-surface-dark);
  }

  .toc-wrapper.open .toc-toggle,
  .toc-wrapper.open #toc {
    background-color: var(--surface-light);
  }

  :global(.dark) .toc-wrapper.open .toc-toggle,
  :global(.dark) .toc-wrapper.open #toc {
    background-color: var(--surface-dark);
  }

  .toc-toggle {
    justify-content: space-between;
    width: 100%;
    gap: var(--px-8);
    padding: var(--px-12) var(--px-18);
    transition: all var(--transition-lg);
  }

  .toc-toggle:hover {
    background-color: var(--modal-btn-on-surface-light-hover);
  }

  :global(.dark) .toc-toggle:hover {
    background-color: var(--on-surface-dark-hover);
  }

  .toc-toggle:active {
    background-color: var(--on-surface-dark);
    color: var(--text-dark);
  }

  :global(.dark) .toc-toggle:active {
    background-color: var(--on-surface-light);
    color: var(--text-light);
  }

  .toc-wrapper.open .toc-toggle:hover {
    background-color: var(--surface-light);
    opacity: 0.85;
  }

  :global(.dark) .toc-wrapper.open .toc-toggle:hover {
    background-color: var(--modal-btn-dark);
    opacity: 1;
  }

  .toc-wrapper.open .toc-toggle:active {
    background-color: var(--surface-dark);
    color: var(--text-dark);
    opacity: 1;
  }

  :global(.dark) .toc-wrapper.open .toc-toggle:active {
    background-color: var(--surface-light);
    color: var(--text-light);
    opacity: 1;
  }

  .toggle-icon {
    font-size: 1.2rem;
    line-height: 1;
    transition: transform var(--transition-lg);
  }

  .toc-wrapper.open .toggle-icon {
    transform: rotate(180deg);
  }

  #toc {
    display: none;
    overflow: hidden;
  }

  .toc-wrapper.open #toc {
    display: block;
    position: absolute;
    width: 100%;
    margin-top: var(--px-16);
  }

  .toc-list {
    overflow-y: auto;
    padding: var(--px-12) var(--px-10);
    padding-block: var(--px-12);
  }

  .item-link {
    padding: var(--px-8) var(--px-16);
    border-radius: var(--radius-on-surface);
    transition: background-color var(--transition-lg);
  }

  .item-link:hover {
    background-color: var(--on-surface-light-hover);
  }

  :global(.dark) .item-link:hover {
    background-color: var(--on-surface-dark-hover);
  }

  .item-link:active {
    background-color: var(--on-surface-dark);
    color: var(--text-dark);
  }

  :global(.dark) .item-link:active {
    background-color: var(--on-surface-light);
    color: var(--text-light);
  }
</style>
