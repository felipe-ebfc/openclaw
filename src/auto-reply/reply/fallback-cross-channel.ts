/**
 * Cross-channel fallback notification broadcaster.
 *
 * When a model fallback switch occurs, the originating channel already gets
 * the notice inline.  This module sends the same notice to other channels
 * the user has recently communicated on so they see the switch regardless
 * of which channel they check next.
 */

import type { OpenClawConfig } from "../../config/config.js";
import { loadSessionStore } from "../../config/sessions/store.js";
import type { SessionEntry } from "../../config/sessions/types.js";
import type { OriginatingChannelType } from "../templating.js";
import type { ReplyPayload } from "../types.js";
import { routeReply } from "./route-reply.js";

type CrossChannelTarget = {
  channel: string;
  to: string;
  accountId?: string;
};

/**
 * Discover other channels the user has used by scanning the session store
 * for entries with a `lastChannel` different from the originating one.
 */
function discoverOtherChannels(params: {
  storePath: string;
  originatingChannel: string;
  originatingTo: string;
}): CrossChannelTarget[] {
  let store: Record<string, SessionEntry>;
  try {
    store = loadSessionStore(params.storePath);
  } catch {
    return [];
  }

  const seen = new Set<string>();
  const targets: CrossChannelTarget[] = [];
  // Key used to skip the originating channel.
  const originKey = `${params.originatingChannel}|${params.originatingTo}`.toLowerCase();
  seen.add(originKey);

  for (const entry of Object.values(store)) {
    const channel = entry.lastChannel ?? entry.deliveryContext?.channel;
    const to = entry.lastTo ?? entry.deliveryContext?.to;
    if (!channel || !to) {
      continue;
    }
    const key = `${channel}|${to}`.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    targets.push({
      channel,
      to,
      accountId: entry.lastAccountId ?? entry.deliveryContext?.accountId,
    });
  }
  return targets;
}

/**
 * Send a fallback notice to all channels other than the originating one.
 * Fire-and-forget — failures are silently ignored.
 */
export function broadcastFallbackNotice(params: {
  notice: string;
  originatingChannel: string;
  originatingTo: string;
  sessionKey?: string;
  storePath?: string;
  cfg: OpenClawConfig;
}): void {
  if (!params.storePath) {
    return;
  }

  const targets = discoverOtherChannels({
    storePath: params.storePath,
    originatingChannel: params.originatingChannel,
    originatingTo: params.originatingTo,
  });

  if (targets.length === 0) {
    return;
  }

  const payload: ReplyPayload = { text: params.notice };

  for (const target of targets) {
    routeReply({
      payload,
      channel: target.channel as OriginatingChannelType,
      to: target.to,
      sessionKey: params.sessionKey,
      accountId: target.accountId,
      cfg: params.cfg,
      mirror: false, // Don't mirror cross-channel notices into the session transcript.
    }).catch(() => {
      // Best-effort — cross-channel notification is non-critical.
    });
  }
}
