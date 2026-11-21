"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Bot,
  Copy,
  CheckCheck,
  Loader2,
  Maximize2,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

const SYSTEM_PROMPT =
  "You are a friendly AI assistant who speaks in a Puneri (Pune, India) Marathi-influenced Hinglish style. " +
  "Use occasional Marathi words like 're', 'bara', 'majja', 'vada pav', 'misal pav', 'aika'. " +
  "Keep replies warm, short, and conversational. Respond in the same language as the user.";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: input.trim() },
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content || "Kahi gadbad zhali re, try kara para.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Server thambla ka? Please try again later.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-lg px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold tracking-tight">Pune<span className="text-primary">.Bol</span></span>
          </div>
          <p className="text-xs text-muted-foreground hidden md:block">
            A Puneri Way AI Talks in Marathi &middot; Powered by Groq
          </p>
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-foreground transition">
              <Sun className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-4">
                <Bot className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-sm font-medium font-marathi">नमस्कार रे!</h3>
              <p className="text-xs max-w-xs mt-1 font-marathi">
                बोलू का. मला विचारा काहीही - मी इथे आहे तुमच्यामधील मदतीसाठी.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <Card
                  className={`rounded-xl p-4 shadow-sm border ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto md:max-w-[80%]"
                      : "bg-card text-card-foreground mr-auto md:max-w-[80%]"
                  }`}
                >
                  <CardHeader className="flex flex-row items-center gap-1.5 pb-1">
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 opacity-80" />
                    ) : (
                      <Bot className="h-3 w-3 opacity-80" />
                    )}
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                      {msg.role === "user" ? "Tu" : "AI"}
                    </span>
                    {msg.role === "user" && <CheckCheck className="h-3 w-3 ml-auto opacity-60" />}
                  </CardHeader>
                  <CardContent className="pt-0 text-sm leading-relaxed whitespace-pre-wrap font-marathi">
                    {msg.content}
                  </CardContent>
                </Card>
                {msg.role === "assistant" && (
                  <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      className="rounded p-1.5 bg-muted hover:bg-accent text-xs text-muted-foreground hover:text-accent-foreground transition"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex flex-col gap-1.5 items-start">
                <Card className="bg-card text-card-foreground rounded-xl p-4 border shadow-sm mr-auto md:max-w-[80%]">
                  <CardHeader className="flex flex-row items-center gap-1.5 pb-1">
                    <Bot className="h-3 w-3 opacity-80" />
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                      AI
                    </span>
                  </CardHeader>
                  <CardContent className="pt-0 flex gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Type-la... </span>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={sendMessage}
          className="sticky bottom-0 z-20 border-t bg-background/90 backdrop-blur-md p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="तुमचं संदेश लिहा... (उदा. 'वडा पाव खावा का?')"
                disabled={loading}
                className="min-h-[60px] md:min-h-[80px] max-h-[200px] resize-none font-marathi"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="whitespace-nowrap px-6"
            >
              {loading ? (
                <span>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </span>
              ) : (
                <span>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Pathvuna
                </span>
              )}
            </Button>
          </div>
          <div className="mt-2 flex justify-between items-center max-w-3xl mx-auto px-1">
            <span className="text-[10px] text-muted-foreground">
              Groq-powered &middot; Fast &amp; efficient
            </span>
            <button className="text-xs text-muted-foreground hover:text-foreground transition underline">
              Clear chat
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
