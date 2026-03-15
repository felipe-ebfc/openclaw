import {
  CONTROL_UI_BOOTSTRAP_CONFIG_PATH,
  type ControlUiBootstrapConfig,
} from "../../../../src/gateway/control-ui-contract.js";
import { normalizeAssistantIdentity } from "../assistant-identity.ts";
import { normalizeBasePath } from "../navigation.ts";
import { loadSettings, saveSettings } from "../storage.ts";

export type ControlUiBootstrapState = {
  basePath: string;
  assistantName: string;
  assistantAvatar: string | null;
  assistantAgentId: string | null;
  serverVersion: string | null;
};

export async function loadControlUiBootstrapConfig(state: ControlUiBootstrapState) {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof fetch !== "function") {
    return;
  }

  const basePath = normalizeBasePath(state.basePath ?? "");
  const url = basePath
    ? `${basePath}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`
    : CONTROL_UI_BOOTSTRAP_CONFIG_PATH;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    if (!res.ok) {
      return;
    }
    const parsed = (await res.json()) as ControlUiBootstrapConfig;
    const normalized = normalizeAssistantIdentity({
      agentId: parsed.assistantAgentId ?? null,
      name: parsed.assistantName,
      avatar: parsed.assistantAvatar ?? null,
    });
    state.assistantName = normalized.name;
    state.assistantAvatar = normalized.avatar;
    state.assistantAgentId = normalized.agentId ?? null;
    state.serverVersion = parsed.serverVersion ?? null;
    if (parsed.autoAuthToken) {
      const current = loadSettings();
      if (current.token !== parsed.autoAuthToken) {
        const proto = window.location.protocol === "https:" ? "wss" : "ws";
        saveSettings({
          ...current,
          token: parsed.autoAuthToken,
          gatewayUrl: current.gatewayUrl || `${proto}://${window.location.host}`,
          sessionKey: current.sessionKey || "main",
          theme: current.theme === "system" ? "dark" : current.theme,
        });
      }
    }
  } catch {
    // Ignore bootstrap failures; UI will update identity after connecting.
  }
}
