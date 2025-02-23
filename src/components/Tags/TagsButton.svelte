<script lang="ts">
  import { modalStore } from '@components/Modal/modalStore.svelte';
</script>

<button
  class="nav-link btn"
  onclick={() => modalStore.open('tags')}
  aria-label="Open tags"
  aria-expanded={modalStore.isOpen('tags')}
>
  Tags
</button>
