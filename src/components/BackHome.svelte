<script lang="ts">
  import { navigate } from 'astro:transitions/client';

  let previousUrl = $state(sessionStorage.getItem('previousPageUrl') || '/');

  function handleBack() {
    navigate(previousUrl);
    sessionStorage.removeItem('previousPageUrl');
  }
</script>

<button class="btn primary-btn back-home-btn" onclick={handleBack}>
  Back home
</button>

<style>
  .back-home-btn {
    padding: var(--px-12) var(--px-16);
    border-radius: var(--radius-surface);
    text-wrap: nowrap;
  }
</style>
