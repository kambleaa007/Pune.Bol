"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  CheckCheck,
  Loader2,
  Moon,
  Send,
  Sun,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

const SYSTEM_PROMPT =
  "You are a friendly AI assistant who speaks in Marathi (Devanagari script). " +
  "Use a Puneri (Pune, India) style with Marathi words like 'रें', 'बरं', 'मज्जा', 'वडा पाव', 'मिसळ पाव', 'ऐका'. " +
  "Always reply ONLY in Marathi using Devanagari script, even if the user writes in English or Hinglish. " +
  "Keep replies warm, short, and conversational.";

const TAGS = [
  "वडा पाव",
  "मिसळ पाव",
  "पुणेकर",
  "मस्त",
  "बरं",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    const timer = setTimeout(scrollToBottom, 80);
    return () => clearTimeout(timer);
  }, [messages, loading]);

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
        content: data.content || "मला माहित नाही रे, पुन्हा प्रयत्न करा.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "काही समस्या आली आहे, पुन्हा ट्राय करा नंतर.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-900 transition-colors duration-500">
      {/* Background glow orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-purple-200/60 dark:bg-purple-900/30 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-pink-200/60 dark:bg-pink-900/20 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-5%] w-[30rem] h-[30rem] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-[100px] pointer-events-none"></div>

      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-white/30 dark:border-slate-700/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Pune<span className="text-purple-600 dark:text-purple-400">.Bol</span></h1>
            <p className="text-xs text-muted-foreground">मराठी AI चॅट</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center text-secondary-foreground transition"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 max-w-2xl mx-auto w-full">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setInput(tag)}
              className="px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/80 border border-white/30 dark:border-slate-600/30 text-xs font-medium text-foreground hover:bg-white/80 dark:hover:bg-slate-700 transition backdrop-blur"
            >
              {tag}
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-muted-foreground">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-800/50 p-4 mb-6 shadow-sm border border-white/20 dark:border-white/10">
                <Bot className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold font-marathi">नमस्कार रे!</h3>
              <p className="text-xs mt-1 max-w-xs font-marathi">
                बोलू का. मला विचारा काहीही - मी इथे आहे तुमच्यामधील मदतीसाठी.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <Card
                  className={`rounded-2xl p-4 shadow-sm border ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white ml-auto md:max-w-[85%] dark:from-purple-700 dark:to-indigo-700"
                      : "bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 mr-auto md:max-w-[85%]"
                  }`}
                >
                  <CardHeader className="flex flex-row items-center gap-2 pb-1">
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 opacity-70" />
                    ) : (
                      <Bot className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                      {msg.role === "user" ? "तू" : "एआय"}
                    </span>
                    {msg.role === "user" && <CheckCheck className="h-3 w-3 ml-auto opacity-50" />}
                  </CardHeader>
                  <CardContent className="pt-0 text-sm leading-relaxed whitespace-pre-wrap font-marathi">
                    {msg.content}
                  </CardContent>
                </Card>
              </div>
            ))}
            {loading && (
              <div className="flex flex-col gap-2 items-start">
                <Card
                  className="rounded-2xl p-4 shadow-sm border bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 mr-auto md:max-w-[85%] animate-pulse"
                >
                  <CardHeader className="flex flex-row items-center gap-2 pb-1">
                    <Bot className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                      एआय
                    </span>
                  </CardHeader>
                  <CardContent className="pt-0 flex gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-muted-foreground font-marathi">
                      टाइप करत आहे...
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <form
        onSubmit={sendMessage}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pt-4 pb-6 max-w-2xl w-full"
      >
        <div className="flex items-end gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 p-3 shadow-xl">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="तुमचं संदेश लिहा... (उदा. 'वडा पाव खावा का?')"
              disabled={loading}
              className="min-h-[52px] max-h-[120px] resize-none bg-transparent border-none outline-none text-sm font-marathi text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 px-2 py-2"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200/50 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
        <div className="mt-3 flex justify-between items-center text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            ग्रoq पॉवर्ड &bull; वेगवान
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            GenZ व्हाइब
          </span>
        </div>
      </form>
    </div>
  );
}
