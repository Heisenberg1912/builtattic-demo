import React, { useState } from "react";
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane } from "react-icons/hi2";

const presetReplies = [
  "Thanks for reaching out. An operations specialist will join shortly.",
  "Share your order ID to start the triage.",
  "Need to reschedule a service slot? We're on it.",
];

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      from: "support",
      text: "Hi there! How can Builtattic help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const outbound = {
      from: "user",
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [...prev, outbound]);
    setMessage("");
    const reply = presetReplies[Math.floor(Math.random() * presetReplies.length)];
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        {
          from: "support",
          text: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 rounded-2xl shadow-xl border border-slate-200 bg-white flex flex-col overflow-hidden">
          <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Builtattic</p>
              <p className="text-xs text-slate-300">We'll reply as soon as we can</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white text-lg leading-none"
              aria-label="Close support chat"
            >
              ×
            </button>
          </header>
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-slate-50">
            {history.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                  entry.from === "support"
                    ? "bg-white text-slate-700 border border-slate-200 self-start"
                    : "bg-slate-900 text-white ml-auto"
                }`}
              >
                {entry.text}
              </div>
            ))}
          </div>
          <footer className="border-t border-slate-200 px-3 py-2 flex items-center gap-2">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write your message..."
              className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              aria-label="Send message"
            >
              <HiOutlinePaperAirplane className="w-4 h-4" />
            </button>
          </footer>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition"
          aria-label="Open support chat"
        >
          <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default SupportChatWidget;
