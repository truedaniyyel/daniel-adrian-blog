<script lang="ts">
  import { SOCIALS } from '@consts';
  import uiIcons from '@assets/uiIcons';
  import socialIcons from '@assets/socialIcons';

  let isLinksOpen = $state(false);

  function KeydownEscape(e: KeyboardEvent) {
    if (!isLinksOpen || e.code !== 'Escape') return;
    isLinksOpen = false;
  }

  function FocusOutEvent(e: FocusEvent) {
    const nextFocusedElement = e.relatedTarget as HTMLElement;

    if (!nextFocusedElement || !nextFocusedElement.closest(`#links-menu`))
      isLinksOpen = false;
  }
</script>

<svelte:window onkeydown={KeydownEscape} onfocusout={FocusOutEvent} />

<div class="links-wrapper">
  <button
    class={['nav-link', 'btn', 'links-btn', { 'btn-active': isLinksOpen }]}
    onclick={() => (isLinksOpen = !isLinksOpen)}
    aria-expanded={isLinksOpen}
    aria-controls="links-menu"
  >
    Links
    <span class={['links-btn-icon', { 'onopen-chevron': isLinksOpen }]}>
      {@html isLinksOpen
        ? uiIcons.chevron.chevronUp
        : uiIcons.chevron.chevronDown}
    </span>
  </button>

  <div id="links-menu" class={{ 'onopen-animation': isLinksOpen }}>
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

<style>
  .links-wrapper {
    position: relative;
    display: flex;
    min-height: 100%;
  }

  .links-btn {
    gap: var(--px-8);
  }

  .links-btn-icon {
    width: var(--px-12);
  }

  #links-menu {
    position: absolute;
    top: 100%;
    right: 0;
    display: none;
    margin-top: var(--px-16);
    padding: var(--px-12);
    border-radius: var(--radius-surface);
    background-color: var(--surface-light);
    box-shadow: var(--shadow-md-light);
  }

  :global(.dark) #links-menu {
    background-color: var(--surface-dark);
    box-shadow: var(--shadow-sm-dark);
  }

  .social-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--px-16);
    margin-bottom: var(--px-16);
  }

  @media (max-width: 50rem) {
    .links-wrapper {
      display: none;
    }
  }
</style>
