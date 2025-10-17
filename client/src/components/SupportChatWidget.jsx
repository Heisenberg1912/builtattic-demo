import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane } from "react-icons/hi2";

const API_BASE = "/api/support";
const LOCAL_THREAD_KEY = "builtattic_support_thread";
const LOCAL_EMAIL_KEY = "builtattic_support_email";

const formatMessageTime = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [contactEmail, setContactEmail] = useState(() => localStorage.getItem(LOCAL_EMAIL_KEY) || "");
  const [emailDraft, setEmailDraft] = useState("");
  const [threadId, setThreadId] = useState(() => localStorage.getItem(LOCAL_THREAD_KEY) || "");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const seededHistory = useMemo(() => {
    if (history.length > 0) return history;
    return [
      {
        sender: "support",
        body: "Hi there! How can Builtattic help you today?",
        at: new Date().toISOString(),
      },
    ];
  }, [history]);

  const fetchThread = useCallback(
    async (id, silent = false) => {
      if (!id) return;
      if (!silent) setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/chat/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setThreadId("");
            localStorage.removeItem(LOCAL_THREAD_KEY);
            setHistory([]);
            return;
          }
          throw new Error("Unable to load support conversation.");
        }
        const data = await response.json();
        setHistory(data.messages || []);
        if (data.contactEmail && !contactEmail) {
          setContactEmail(data.contactEmail);
          localStorage.setItem(LOCAL_EMAIL_KEY, data.contactEmail);
        }
      } catch (err) {
        console.error(err);
        if (!silent) setError(err.message || "Something went wrong loading chat history.");
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [contactEmail],
  );

  useEffect(() => {
    if (threadId) {
      fetchThread(threadId);
    }
  }, [threadId, fetchThread]);

  useEffect(() => {
    if (!threadId) return undefined;
    const delay = isOpen ? 4000 : 8000;
    const interval = setInterval(() => fetchThread(threadId, true), delay);
    return () => clearInterval(interval);
  }, [threadId, isOpen, fetchThread]);

  const persistEmail = (value) => {
    setContactEmail(value);
    if (value) {
      localStorage.setItem(LOCAL_EMAIL_KEY, value);
    } else {
      localStorage.removeItem(LOCAL_EMAIL_KEY);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!contactEmail) {
      setError("Please add a contact email before starting the chat.");
      return;
    }
    setIsSending(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: threadId || undefined,
          message: message.trim(),
          contactEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send message. Please try again.");
      }
      setMessage("");
      setHistory(data.messages || []);
      if (!threadId && data.threadId) {
        setThreadId(data.threadId);
        localStorage.setItem(LOCAL_THREAD_KEY, data.threadId);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmailSave = () => {
    const trimmed = emailDraft.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setError("Enter a valid email address so the support team can reach you.");
      return;
    }
    persistEmail(trimmed);
    setEmailDraft("");
    setError("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <header className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Builtattic</p>
              <p className="text-xs text-slate-300">We&apos;ll reply as soon as we can</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-lg leading-none text-slate-300 hover:text-white"
              aria-label="Close support chat"
            >
              ×
            </button>
          </header>

          {!contactEmail ? (
            <div className="flex flex-1 flex-col gap-3 bg-slate-50 px-4 py-5 text-sm text-slate-700">
              <p className="text-slate-600">
                Let us know where we can email you. Replies from our specialists will still appear in this chat.
              </p>
              <input
                value={emailDraft}
                onChange={(event) => setEmailDraft(event.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button
                onClick={handleEmailSave}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Save &amp; start chat
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-[11px] text-slate-600">
                <span>Chat linked to: {contactEmail}</span>
                <button
                  onClick={() => {
                    setEmailDraft(contactEmail || "");
                    persistEmail("");
                    setThreadId("");
                    localStorage.removeItem(LOCAL_THREAD_KEY);
                    setHistory([]);
                    setError("");
                  }}
                  className="text-slate-500 underline hover:text-slate-700"
                >
                  change
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-3">
                {isLoading && <p className="text-center text-xs text-slate-500">Loading conversation…</p>}
                {seededHistory.map((entry, index) => (
                  <div
                    key={`${entry.at}-${index}`}
                    className={`max-w-[82%] rounded-xl px-3 py-2 text-xs ${
                      entry.sender === "support"
                        ? "self-start border border-slate-200 bg-white text-slate-700"
                        : "ml-auto bg-slate-900 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{entry.body}</p>
                    <span
                      className={`mt-1 block text-[10px] ${
                        entry.sender === "support" ? "text-slate-400" : "text-slate-300"
                      }`}
                    >
                      {formatMessageTime(entry.at)}
                    </span>
                  </div>
                ))}
              </div>
              <footer className="flex items-start gap-2 border-t border-slate-200 px-3 py-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Write your message..."
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Send message"
                >
                  <HiOutlinePaperAirplane className="h-4 w-4" />
                </button>
              </footer>
            </>
          )}

          {error && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-[11px] text-red-600">{error}</div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
            setError("");
          }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg transition hover:bg-slate-700"
          aria-label="Open support chat"
        >
          <HiOutlineChatBubbleLeftRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SupportChatWidget;

