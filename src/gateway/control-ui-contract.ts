export const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/__openclaw/control-ui-config.json";

export type ControlUiBootstrapConfig = {
  basePath: string;
  assistantName: string;
  assistantAvatar: string;
  assistantAgentId: string;
  serverVersion?: string;
  /** Gateway token for automatic auth seeding. Only present when EBFC_AUTO_AUTH=true. */
  autoAuthToken?: string;
};
