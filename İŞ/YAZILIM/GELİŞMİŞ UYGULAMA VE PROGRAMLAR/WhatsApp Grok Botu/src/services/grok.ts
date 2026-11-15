import type { Config } from "../config.js";
import type { Db } from "../db.js";
import { SYSTEM_PROMPT } from "../policy/system-prompt.js";
import type { Job } from "../types.js";
import { executeAgentTool, toolDefinitions } from "./agent-tools.js";
import { loadConversationContext } from "./context.js";

interface FunctionCallItem {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
}

interface MessageItem {
  type: "message";
  content?: Array<{ type?: string; text?: string }>;
}

interface XaiResponse {
  id: string;
  output?: Array<FunctionCallItem | MessageItem | { type: string }>;
  error?: { message?: string };
}

async function callXai(config: Config, body: Record<string, unknown>): Promise<XaiResponse> {
  if (!config.XAI_API_KEY) throw new Error("XAI_API_KEY tanımlı değil.");

  const response = await fetch(`${config.XAI_BASE_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });
  const result = (await response.json()) as XaiResponse;
  if (!response.ok || !result.id) {
    throw new Error(`xAI isteği başarısız: ${result.error?.message ?? response.statusText}`);
  }
  return result;
}

function functionCalls(response: XaiResponse): FunctionCallItem[] {
  return (response.output ?? []).filter((item): item is FunctionCallItem => item.type === "function_call");
}

export async function runGrokForJob(input: {
  config: Config;
  db: Db;
  job: Job;
}): Promise<void> {
  const context = await loadConversationContext(input.db, input.job.conversation_id);
  const trigger =
    input.job.kind === "commitment_due"
      ? "Açık işin son tarihi geldi. Yeni süre sözü vermeden doğrulanmış sonucu veya dürüst başarısızlık mesajını gönder ve açık işi kapat."
      : "Yeni müşteri mesajını şimdi işle ve uygun yanıtı gönder.";

  let response = await callXai(input.config, {
    model: input.config.XAI_MODEL,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          trigger,
          job: { kind: input.job.kind, payload: input.job.payload },
          conversation: context,
        }),
      },
    ],
    tools: toolDefinitions,
    tool_choice: "required",
    parallel_tool_calls: false,
  });

  for (let step = 0; step < 12; step += 1) {
    const calls = functionCalls(response);
    if (calls.length === 0) {
      throw new Error("Grok zorunlu araç çağrısı üretmedi.");
    }

    const outputs: Array<Record<string, unknown>> = [];
    let sentMessage = false;

    for (const call of calls) {
      const execution = await executeAgentTool({
        config: input.config,
        db: input.db,
        conversationId: input.job.conversation_id,
        triggerKind: input.job.kind,
        name: call.name,
        argumentsJson: call.arguments,
      });
      outputs.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(execution.output),
      });
      sentMessage ||= execution.sentMessage;
    }

    if (sentMessage) return;

    response = await callXai(input.config, {
      model: input.config.XAI_MODEL,
      previous_response_id: response.id,
      input: outputs,
      tools: toolDefinitions,
      tool_choice: "required",
      parallel_tool_calls: false,
    });
  }

  throw new Error("Grok araç döngüsü izin verilen adım sayısını aştı.");
}
