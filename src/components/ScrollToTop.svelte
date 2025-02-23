<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import { onMount } from 'svelte';

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
  >
    {@html uiIcons.goUp}
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
    right: var(--px-24);
    bottom: var(--px-24);
    padding: var(--px-8) var(--px-12);
    border-radius: 100%;
    font-weight: bold;
  }

  .marker {
    position: absolute;
  }

  .hidden {
    display: none;
  }
</style>
