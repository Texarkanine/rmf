import type { LlmClient } from "../types.js";
import { PINNED_MODEL } from "./grades.js";

const XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions";

/**
 * OpenAI-compatible xAI chat client. Images are sent as labeled data URLs
 * so findings can cite `artifacts/<stage>.png`.
 * @see https://docs.x.ai/docs/guides/image-understanding
 */
export function xaiClient(apiKey: string): LlmClient {
  return {
    async complete({ system, user, images }) {
      const content: Array<Record<string, unknown>> = [{ type: "text", text: user }];
      for (const image of images) {
        content.push({
          type: "text",
          text: `Screenshot ${image.path}:`,
        });
        content.push({
          type: "image_url",
          image_url: {
            url: `data:${image.mimeType};base64,${image.base64}`,
            detail: "high",
          },
        });
      }
      const response = await fetch(XAI_CHAT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(360_000),
        body: JSON.stringify({
          model: PINNED_MODEL,
          temperature: 0,
          messages: [
            { role: "system", content: system },
            { role: "user", content },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error(`xAI ${response.status}: ${await response.text()}`);
      }
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("xAI returned an empty completion");
      }
      return text;
    },
  };
}
