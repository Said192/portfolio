"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Who is Said Wali Khan?",
  "What projects has he completed?",
  "What programming languages does he know?",
  "How can I contact him?",
];

/** Floating AI assistant grounded in the JSON knowledge base. */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm Said's portfolio assistant. Ask me about his projects, skills, education, or how to get in touch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = (await res.json()) as { ok: boolean; answer?: string; error?: string };
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: json.ok && json.answer ? json.answer : (json.error ?? "Sorry, something went wrong."),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "I couldn't reach the server. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className="focus-ring fixed bottom-6 right-6 z-50 rounded-full bg-[#86efac] p-4 text-[#052e16] shadow-[0_0_30px_rgb(134_239_172/0.45)] transition hover:scale-105 hover:bg-[#6ee7a7]"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="AI assistant chat"
            className="glass fixed bottom-24 right-6 z-50 flex h-[28rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl shadow-glow"
          >
            <div className="flex items-center gap-2 border-b border-edge bg-gradient-to-r from-[#86efac] to-[#4ade80] px-4 py-3 text-[#052e16]">
              <Bot className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Portfolio Assistant</p>
                <p className="text-xs opacity-70">Ask me anything about Said</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-[#86efac] text-[#052e16]"
                      : "bg-surface text-ink shadow-soft"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {messages.length === 1 ? (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void ask(s)}
                      className="focus-ring block w-full rounded-xl border border-edge px-3 py-2 text-left text-xs text-ink-muted transition hover:border-primary/60 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              {busy ? (
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Thinking…
                </div>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-edge p-3">
              <label htmlFor="assistant-input" className="sr-only">
                Ask a question
              </label>
              <input
                id="assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Said…"
                className="focus-ring w-full rounded-full border border-edge bg-surface/70 px-4 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send question"
                className="focus-ring rounded-full bg-[#86efac] p-2.5 text-[#052e16] transition hover:bg-[#6ee7a7] disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
