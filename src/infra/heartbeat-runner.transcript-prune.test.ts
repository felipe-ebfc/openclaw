import fs from "node:fs/promises";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveMainSessionKey } from "../config/sessions.js";
import { runHeartbeatOnce } from "./heartbeat-runner.js";
import {
  seedSessionStore,
  setupTelegramHeartbeatPluginRuntimeForTests,
  withTempTelegramHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";

// Avoid pulling optional runtime deps during isolated runs.
vi.mock("jiti", () => ({ createJiti: () => () => ({}) }));

beforeEach(() => {
  setupTelegramHeartbeatPluginRuntimeForTests();
});

describe("heartbeat transcript pruning", () => {
  async function createTranscriptWithContent(transcriptPath: string, sessionId: string) {
    const header = {
      type: "session",
      version: 3,
      id: sessionId,
      timestamp: new Date().toISOString(),
      cwd: process.cwd(),
    };
    const existingContent = `${JSON.stringify(header)}\n{"role":"user","content":"Hello"}\n{"role":"assistant","content":"Hi there"}\n`;
    await fs.mkdir(path.dirname(transcriptPath), { recursive: true });
    await fs.writeFile(transcriptPath, existingContent);
    return existingContent;
  }

  async function runTranscriptScenario(params: {
    sessionId: string;
    reply: {
      text: string;
      usage: {
        inputTokens: number;
        outputTokens: number;
        cacheReadTokens: number;
        cacheWriteTokens: number;
      };
    };
    expectPruned: boolean;
  }) {
    await withTempTelegramHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const sessionKey = resolveMainSessionKey(undefined);
        const transcriptPath = path.join(tmpDir, `${params.sessionId}.jsonl`);
        const originalContent = await createTranscriptWithContent(transcriptPath, params.sessionId);
        const originalSize = (await fs.stat(transcriptPath)).size;

        await seedSessionStore(storePath, sessionKey, {
          sessionId: params.sessionId,
          lastChannel: "telegram",
          lastProvider: "telegram",
          lastTo: "user123",
        });

        replySpy.mockResolvedValueOnce(params.reply);

        const cfg = {
          version: 1,
          model: "test-model",
          agent: { workspace: tmpDir },
          sessionStore: storePath,
          channels: { telegram: {} },
        } as unknown as OpenClawConfig;

        await runHeartbeatOnce({
          agentId: undefined,
          reason: "test",
          cfg,
          deps: { sendTelegram: vi.fn() },
        });

        const finalSize = (await fs.stat(transcriptPath)).size;
        if (params.expectPruned) {
          const finalContent = await fs.readFile(transcriptPath, "utf-8");
          expect(finalContent).toBe(originalContent);
          expect(finalSize).toBe(originalSize);
          return;
        }
        expect(finalSize).toBeGreaterThanOrEqual(originalSize);
      },
      { prefix: "openclaw-hb-prune-" },
    );
  }

  it("prunes transcript when heartbeat returns HEARTBEAT_OK", async () => {
    await runTranscriptScenario({
      sessionId: "test-session-prune",
      reply: {
        text: "HEARTBEAT_OK",
        usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      },
      expectPruned: true,
    });
  });

  it("does not prune transcript when heartbeat returns meaningful content", async () => {
    await runTranscriptScenario({
      sessionId: "test-session-no-prune",
      reply: {
        text: "Alert: Something needs your attention!",
        usage: { inputTokens: 10, outputTokens: 20, cacheReadTokens: 0, cacheWriteTokens: 0 },
      },
      expectPruned: false,
    });
  });

  it("preserves concurrent chat messages written during heartbeat window", async () => {
    await withTempTelegramHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const sessionId = "test-session-concurrent";
        const sessionKey = resolveMainSessionKey(undefined);
        const transcriptPath = path.join(tmpDir, `${sessionId}.jsonl`);
        const originalContent = await createTranscriptWithContent(transcriptPath, sessionId);

        await seedSessionStore(storePath, sessionKey, {
          sessionId,
          lastChannel: "telegram",
          lastProvider: "telegram",
          lastTo: "user123",
        });

        // Simulate the race: during getReplyFromConfig (the heartbeat model call),
        // both the heartbeat entries AND a concurrent webchat message get appended.
        // The heartbeat user message is written first, then a concurrent chat message
        // arrives and appends its entry, then the heartbeat assistant response follows.
        const heartbeatUserEntry = {
          type: "message",
          id: "hb-user-01",
          parentId: null,
          timestamp: new Date().toISOString(),
          message: {
            role: "user",
            content: [{ type: "text", text: "Check HEARTBEAT.md" }],
          },
        };
        const concurrentChatEntry = {
          type: "message",
          id: "chat-msg-01",
          parentId: "hb-user-01",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "text", text: "User asked about the weather" }],
            api: "openai-responses",
            provider: "openclaw",
            model: "delivery-mirror",
          },
        };
        const heartbeatAssistantEntry = {
          type: "message",
          id: "hb-asst-01",
          parentId: "hb-user-01",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "text", text: "HEARTBEAT_OK" }],
            api: "openai-responses",
            provider: "anthropic",
            model: "test-model",
            usage: {
              input: 100,
              output: 10,
              cacheRead: 0,
              cacheWrite: 0,
              totalTokens: 110,
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
            },
            stopReason: "stop",
          },
        };

        // Mock getReplyFromConfig to simulate the race: append heartbeat entries
        // AND a concurrent chat message to the transcript file during the call.
        replySpy.mockImplementationOnce(async () => {
          const lines =
            [
              JSON.stringify(heartbeatUserEntry),
              JSON.stringify(concurrentChatEntry),
              JSON.stringify(heartbeatAssistantEntry),
            ].join("\n") + "\n";
          await fs.appendFile(transcriptPath, lines);
          return {
            text: "HEARTBEAT_OK",
            usage: {
              inputTokens: 0,
              outputTokens: 0,
              cacheReadTokens: 0,
              cacheWriteTokens: 0,
            },
          };
        });

        const cfg = {
          version: 1,
          model: "test-model",
          agent: { workspace: tmpDir },
          session: { store: storePath },
          channels: { telegram: {} },
        } as unknown as OpenClawConfig;

        await runHeartbeatOnce({
          agentId: undefined,
          reason: "test",
          cfg,
          deps: { sendTelegram: vi.fn() },
        });

        const finalContent = await fs.readFile(transcriptPath, "utf-8");
        const finalLines = finalContent.trim().split("\n");

        // The concurrent chat message must survive pruning
        const parsedLines = finalLines.map((line) => {
          try {
            return JSON.parse(line) as Record<string, unknown>;
          } catch {
            return null;
          }
        });

        // The chat message should be present
        const chatMsg = parsedLines.find(
          (entry) => entry?.type === "message" && (entry.id as string) === "chat-msg-01",
        );
        expect(chatMsg).toBeDefined();

        // The heartbeat user message should be removed
        const hbUser = parsedLines.find(
          (entry) => entry?.type === "message" && (entry.id as string) === "hb-user-01",
        );
        expect(hbUser).toBeUndefined();

        // The heartbeat assistant message should be removed
        const hbAsst = parsedLines.find(
          (entry) => entry?.type === "message" && (entry.id as string) === "hb-asst-01",
        );
        expect(hbAsst).toBeUndefined();

        // The original content (header + existing messages) should be intact
        expect(finalContent.startsWith(originalContent)).toBe(true);

        // The surviving chat message should be reparented: its parentId pointed
        // at the removed heartbeat user entry, so it should now point at null
        // (the heartbeat user's original parentId).
        expect(chatMsg?.parentId).toBeNull();
      },
      { prefix: "openclaw-hb-concurrent-" },
    );
  });

  it("reparents surviving entries through multi-level heartbeat chains", async () => {
    await withTempTelegramHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const sessionId = "test-session-repar";
        const sessionKey = resolveMainSessionKey(undefined);
        const transcriptPath = path.join(tmpDir, `${sessionId}.jsonl`);
        await createTranscriptWithContent(transcriptPath, sessionId);

        await seedSessionStore(storePath, sessionKey, {
          sessionId,
          lastChannel: "telegram",
          lastProvider: "telegram",
          lastTo: "user123",
        });

        // Simulate a heartbeat with tool use: user → assistant(tool_call) →
        // toolResult → assistant(final). A concurrent message appended after
        // the final assistant entry.
        const hbUser = {
          type: "message",
          id: "hb-u",
          parentId: "pre-existing",
          timestamp: new Date().toISOString(),
          message: { role: "user", content: "heartbeat check" },
        };
        const hbAssist1 = {
          type: "message",
          id: "hb-a1",
          parentId: "hb-u",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "toolCall", id: "tc1", name: "bash", arguments: {} }],
          },
        };
        const hbToolResult = {
          type: "message",
          id: "hb-tr",
          parentId: "hb-a1",
          timestamp: new Date().toISOString(),
          message: { role: "toolResult", toolCallId: "tc1", content: [], isError: false },
        };
        const hbAssist2 = {
          type: "message",
          id: "hb-a2",
          parentId: "hb-tr",
          timestamp: new Date().toISOString(),
          message: { role: "assistant", content: [{ type: "text", text: "HEARTBEAT_OK" }] },
        };
        const concurrent = {
          type: "message",
          id: "chat-01",
          parentId: "hb-a2",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "text", text: "delivery mirror" }],
            model: "delivery-mirror",
          },
        };

        replySpy.mockImplementationOnce(async () => {
          const lines =
            [hbUser, hbAssist1, hbToolResult, hbAssist2, concurrent]
              .map((e) => JSON.stringify(e))
              .join("\n") + "\n";
          await fs.appendFile(transcriptPath, lines);
          return {
            text: "HEARTBEAT_OK",
            usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
          };
        });

        const cfg = {
          version: 1,
          model: "test-model",
          agent: { workspace: tmpDir },
          session: { store: storePath },
          channels: { telegram: {} },
        } as unknown as OpenClawConfig;

        await runHeartbeatOnce({
          agentId: undefined,
          reason: "test",
          cfg,
          deps: { sendTelegram: vi.fn() },
        });

        const finalContent = await fs.readFile(transcriptPath, "utf-8");
        const parsed = finalContent
          .trim()
          .split("\n")
          .map((line) => {
            try {
              return JSON.parse(line) as Record<string, unknown>;
            } catch {
              return null;
            }
          });

        // All heartbeat entries should be removed
        const heartbeatIds = ["hb-u", "hb-a1", "hb-tr", "hb-a2"];
        for (const id of heartbeatIds) {
          expect(parsed.find((e) => e?.id === id)).toBeUndefined();
        }

        // The concurrent entry should survive and be reparented to "pre-existing"
        // (the heartbeat user's parentId, walked through the removed chain)
        const survivor = parsed.find((e) => e?.id === "chat-01");
        expect(survivor).toBeDefined();
        expect(survivor?.parentId).toBe("pre-existing");
      },
      { prefix: "openclaw-hb-repar-" },
    );
  });

  it("preserves concurrent user message AND its assistant reply (parentId ancestry)", async () => {
    await withTempTelegramHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const sessionId = "test-session-ancestry";
        const sessionKey = resolveMainSessionKey(undefined);
        const transcriptPath = path.join(tmpDir, `${sessionId}.jsonl`);
        const originalContent = await createTranscriptWithContent(transcriptPath, sessionId);

        await seedSessionStore(storePath, sessionKey, {
          sessionId,
          lastChannel: "telegram",
          lastProvider: "telegram",
          lastTo: "user123",
        });

        // The exact race Osito hit: heartbeat writes its user prompt, then a
        // real webchat user sends a message that gets processed (user + assistant
        // reply with a REAL model, not delivery-mirror), then the heartbeat
        // assistant response arrives.
        //
        // Tree:
        //   pre-existing → hb-user → real-user → real-assistant
        //                         → hb-assistant
        const hbUser = {
          type: "message",
          id: "hb-u",
          parentId: "pre-existing",
          timestamp: new Date().toISOString(),
          message: { role: "user", content: "heartbeat check" },
        };
        const realUser = {
          type: "message",
          id: "real-u",
          parentId: "hb-u",
          timestamp: new Date().toISOString(),
          message: { role: "user", content: "What is the weather?" },
        };
        const realAssistant = {
          type: "message",
          id: "real-a",
          parentId: "real-u",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "text", text: "The weather is sunny." }],
            model: "claude-sonnet-4-20250514",
            provider: "anthropic",
          },
        };
        const hbAssistant = {
          type: "message",
          id: "hb-a",
          parentId: "hb-u",
          timestamp: new Date().toISOString(),
          message: {
            role: "assistant",
            content: [{ type: "text", text: "HEARTBEAT_OK" }],
            model: "claude-sonnet-4-20250514",
            provider: "anthropic",
          },
        };

        replySpy.mockImplementationOnce(async () => {
          const lines =
            [hbUser, realUser, realAssistant, hbAssistant]
              .map((e) => JSON.stringify(e))
              .join("\n") + "\n";
          await fs.appendFile(transcriptPath, lines);
          return {
            text: "HEARTBEAT_OK",
            usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
          };
        });

        const cfg = {
          version: 1,
          model: "test-model",
          agent: { workspace: tmpDir },
          session: { store: storePath },
          channels: { telegram: {} },
        } as unknown as OpenClawConfig;

        await runHeartbeatOnce({
          agentId: undefined,
          reason: "test",
          cfg,
          deps: { sendTelegram: vi.fn() },
        });

        const finalContent = await fs.readFile(transcriptPath, "utf-8");
        const parsed = finalContent
          .trim()
          .split("\n")
          .map((line) => {
            try {
              return JSON.parse(line) as Record<string, unknown>;
            } catch {
              return null;
            }
          });

        // Heartbeat entries should be removed
        expect(parsed.find((e) => e?.id === "hb-u")).toBeUndefined();
        expect(parsed.find((e) => e?.id === "hb-a")).toBeUndefined();

        // Real user message and its assistant reply must SURVIVE
        const realU = parsed.find((e) => e?.id === "real-u");
        const realA = parsed.find((e) => e?.id === "real-a");
        expect(realU).toBeDefined();
        expect(realA).toBeDefined();

        // real-user was reparented from hb-u to pre-existing
        expect(realU?.parentId).toBe("pre-existing");
        // real-assistant still points at real-user (unchanged)
        expect(realA?.parentId).toBe("real-u");

        // Original content intact
        expect(finalContent.startsWith(originalContent)).toBe(true);
      },
      { prefix: "openclaw-hb-ancestry-" },
    );
  });
});
