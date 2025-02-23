<script lang="ts">
  import uiIcons from '@assets/uiIcons';
  import {
    modalStore,
    type ModalType,
  } from '@components/Modal/modalStore.svelte';
  import { fade } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  interface Props {
    type: NonNullable<ModalType>;
    children?: Snippet;
  }

  let { type, children }: Props = $props();

  function handleEscape(e: KeyboardEvent) {
    if (!modalStore.isOpen(type) || e.code !== 'Escape') return;
    e.preventDefault();
    modalStore.close();
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      modalStore.close();
    }
  }
</script>

<svelte:window onkeydown={handleEscape} />

<div
  class="modal-overlay"
  onclick={handleOverlayClick}
  aria-hidden={!modalStore.isOpen(type)}
  transition:fade={{ duration: 200 }}
>
  <div
    class="modal-wrapper modal-fade"
    role="dialog"
    aria-modal="true"
    out:fade={{ duration: 200 }}
  >
    <button
      class="btn modal-btn modal-close-btn"
      onclick={() => modalStore.close()}
      aria-label="Close modal"
    >
      {@html uiIcons.xmark}
    </button>

    {@render children?.()}
  </div>
</div>

<style>
  .modal-wrapper {
    position: relative;
    top: 17.5%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--w-modal);
    z-index: var(--z-max);
    padding-inline: var(--px-16);
  }

  .modal-close-btn {
    position: absolute;
    top: calc(var(--px-48) * -1);
    right: var(--px-16);
    padding-inline: var(--px-12);
  }

  .modal-close-btn :global(svg) {
    width: var(--px-20);
  }
</style>
