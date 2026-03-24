import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state.ts";
import { icons } from "../icons.ts";

export function renderBrainTipCard(state: AppViewState) {
  if (!state.brainTipVisible) {
    return nothing;
  }

  const name = state.assistantName?.trim() || "your companion";

  const prompts = [
    "What do I know about project scheduling?",
    "Remember this: we decided to go with weekly sprints",
    "What's the latest in my brain?",
  ];

  const handlePromptClick = (text: string) => {
    state.chatMessage = text;
    state.handleDismissBrainTip();
    // Focus the input after a tick so the UI updates first
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLTextAreaElement>(
        ".chat-compose textarea, .chat-compose input",
      );
      if (input) {
        input.focus();
      }
    });
  };

  return html`
    <div class="brain-tip-card" role="complementary" aria-label="Brain discovery tip">
      <button
        class="brain-tip-dismiss"
        aria-label="Dismiss"
        @click=${() => state.handleDismissBrainTip()}
      >&times;</button>
      <div class="brain-tip-icon">${icons.brain}</div>
      <div class="brain-tip-header">Your brain is growing 🧠</div>
      <div class="brain-tip-sub">
        ${name} remembers what matters between conversations. Try asking:
      </div>
      <div class="brain-tip-prompts">
        ${prompts.map(
          (p) => html`
            <button class="brain-tip-prompt" @click=${() => handlePromptClick(p)}>
              ${p}
            </button>
          `,
        )}
      </div>
    </div>
  `;
}
