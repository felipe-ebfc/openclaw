import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state.ts";

// Names that are considered generic/unset (case-insensitive)
const GENERIC_NAMES = new Set(["", "assistant", "companion"]);

function isGenericName(name: string): boolean {
  return GENERIC_NAMES.has(name.toLowerCase().trim());
}

export function renderWelcomeOverlay(state: AppViewState) {
  if (!state.welcomeOverlayVisible) {
    return nothing;
  }

  const name = state.assistantName;
  const showName = !isGenericName(name);
  const subtext = showName
    ? `Meet ${name}, your AI companion for construction. Send a message to get started.`
    : "Meet your AI companion for construction.";

  return html`
    <div
      class="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      @click=${() => state.handleDismissWelcomeOverlay()}
    >
      <div class="welcome-card" @click=${(e: Event) => e.stopPropagation()}>
        <img class="welcome-logo" src="/logo-square.png" alt="EBFC AI" />
        <div class="welcome-header">Welcome to EBFC AI</div>
        <div class="welcome-sub">${subtext}</div>
        <button class="btn primary welcome-cta" @click=${() => state.handleDismissWelcomeOverlay()}>
          Get started
        </button>
      </div>
    </div>
  `;
}
