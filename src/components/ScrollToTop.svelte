<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    threshold?: number;
  }

  let { threshold = 512 }: Props = $props();

  let isButtonVisible = $state(false);
  let isMarkerVisible = $state(false);
  let marker: Element;

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onMount(() => {
    if (document.body.offsetHeight >= threshold) {
      isMarkerVisible = true;

      const scrollToTopObserver = new IntersectionObserver(([entry]) => {
        isButtonVisible = !entry.isIntersecting;
      });

      scrollToTopObserver.observe(marker);

      return () => {
        scrollToTopObserver.disconnect();
      };
    }
  });
</script>

{#if isButtonVisible}
  <button
    class="btn primary-btn"
    onclick={scrollToTop}
    aria-label="Scroll to the top"
    transition:fade={{ duration: 150 }}
  >
    {@html uiIcons.arrow.up}
  </button>
{/if}

<div
  bind:this={marker}
  class={['marker', { hidden: !isMarkerVisible }]}
  style="top: {threshold}px;"
  role="presentation"
  aria-hidden="true"
></div>

<style>
  button {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    right: var(--px-24);
    bottom: var(--px-24);
    padding: var(--px-10) var(--px-12);
    border-radius: 100%;
  }

  button :global(svg) {
    width: var(--px-14);
  }

  .marker {
    position: absolute;
  }

  .hidden {
    display: none;
  }
</style>
