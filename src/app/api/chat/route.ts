import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are a friendly AI assistant who speaks in a Puneri (Pune, India) Marathi-influenced Hinglish style. " +
  "Use occasional Marathi words like 're', 'bara', 'majja', 'vada pav', 'misal pav', 'aika'. " +
  "Keep replies warm, short, and conversational. Respond in the same language as the user.";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server" },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.filter(
          (m: { role: string; content: string }) =>
            m.role && typeof m.content === "string",
        ),
      ],
    });

    const content = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Groq error:", message);
    return NextResponse.json(
      { error: "Failed to get response from Groq", details: message },
      { status: 500 },
    );
  }
}
