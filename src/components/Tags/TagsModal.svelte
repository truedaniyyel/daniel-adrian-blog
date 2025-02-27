<script lang="ts">
  import Modal from '@components/Modal/Modal.svelte';
  import { modalStore } from '@components/Modal/modalStore.svelte';
  import { SvelteSet, type SvelteURL } from 'svelte/reactivity';
  import { navigate } from 'astro:transitions/client';

  interface Props {
    url: SvelteURL;
    tags: Set<string>;
    selectedTags: SvelteSet<string>;
  }

  let { url, tags, selectedTags = $bindable() }: Props = $props();

  let tempSelected = $state(new SvelteSet<string>(selectedTags));

  function updateUrlTags() {
    if (selectedTags.size > 0)
      url.searchParams.set('tags', Array.from(selectedTags).join(','));
    else url.searchParams.delete('tags');

    navigate(url.href);
  }

  function toggle(tag: string) {
    tempSelected.has(tag) ? tempSelected.delete(tag) : tempSelected.add(tag);
  }

  function reset() {
    tempSelected = new SvelteSet();
  }

  function apply() {
    selectedTags = new SvelteSet(tempSelected);
    updateUrlTags();
    modalStore.close();
  }
</script>

<Modal type="tags">
  {#snippet children()}
    <div class="tags">
      <ul class="tag-list">
        {#each tags as tag}
          <li>
            <button
              class={['btn tag-btn', tempSelected.has(tag) && 'tag-active-btn']}
              onclick={() => toggle(tag)}
            >
              {tag}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <button class="btn modal-btn reset-btn" onclick={reset}>Reset</button>
    <button class="btn modal-btn apply-btn" onclick={apply}>Apply</button>
  {/snippet}
</Modal>

<!-- </div> -->

<style>
  .tags {
    background-color: var(--surface-light);
    border-radius: var(--radius-surface);
    overflow: hidden;
    margin-bottom: var(--px-8);
  }

  :global(.dark) .tags {
    background-color: var(--surface-dark);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--px-8);
    padding: var(--px-10);
    max-height: var(--h-modal);
    overflow-y: auto;
  }

  .tag-btn {
    padding: var(--px-8) var(--px-16);
    border-radius: var(--radius-on-surface);
    background-color: var(--on-surface-light);
    text-wrap: nowrap;
    transition: all var(--transition-base);
  }

  :global(.dark) .tag-btn {
    background-color: var(--on-surface-dark);
  }

  .tag-btn:hover {
    transform: translateY(-2px);
    background-color: var(--modal-btn-on-surface-light-hover);
  }

  :global(.dark) .tag-btn:hover {
    background-color: var(--on-surface-dark-hover);
  }

  .tag-btn:active {
    transform: translateY(0);
    transform: scale(0.95);
  }

  .tag-active-btn {
    color: var(--text-dark);
    background-color: var(--on-surface-dark);
  }

  :global(.dark) .tag-active-btn {
    color: var(--text-light);
    background-color: var(--on-surface-light);
  }

  .tag-active-btn:hover {
    background-color: var(--on-surface-dark-hover);
  }

  :global(.dark) .tag-active-btn:hover {
    background-color: var(--on-surface-light-hover);
    opacity: 0.85;
  }

  .reset-btn,
  .apply-btn {
    position: absolute;
  }

  .apply-btn {
    right: var(--px-16);
  }
</style>
