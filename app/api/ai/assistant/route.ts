import { NextResponse } from "next/server";
import { createDemoAssistantMessage } from "@/lib/ai-demo";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ message: createDemoAssistantMessage(body.message), source: "demo" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content:
              "You are Foody Fam's cautious cooking assistant. Help parents adapt one family meal for babies and adults. Keep answers practical, concise, allergy-aware, and never a substitute for medical advice."
          },
          { role: "user", content: body.message || "Suggest a safe family lunch." }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ message: createDemoAssistantMessage(body.message), source: "demo", warning: "OpenAI request failed" });
    }

    const data = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const message = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text || createDemoAssistantMessage(body.message);
    return NextResponse.json({ message, source: "openai" });
  } catch {
    return NextResponse.json({ message: createDemoAssistantMessage(body.message), source: "demo", warning: "OpenAI parsing failed" });
  }
}
