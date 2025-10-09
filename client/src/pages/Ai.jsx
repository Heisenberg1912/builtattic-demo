import React, { useState } from "react";
import {
  Send,
  Settings,
  History,
  Sparkles,
  Menu,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";

const starterPrompts = [
  "Assemble a shortlist of studio catalogues for a coastal residential brief under $15/sq.ft.",
  "Recommend procurement bundles for the Skyline Loft studio package (include MOQ, lead time, and QA docs).",
  "Draft an onboarding email for a sustainability associate joining the Terraced Courtyard Villa project.",
  "Summarise outstanding fulfilment tasks for the Urban Mixed-Use Podium order, including payouts and asset releases.",
];

const systemIntro =
  "Hi, I'm Builtattic Assist — your delivery co-pilot. I can surface catalogues, procurement packs, associate talent, and order fulfilment details across your workspace.";

const Ai = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: systemIntro },
  ]);
  const [input, setInput] = useState("");
  const [history] = useState(["Hospitality retrofit", "Masterplan RFP", "BIM QA"]);
  const [highlights, setHighlights] = useState([
    "Try 'Generate a fulfilment checklist for the Skyline Loft order' to see end-to-end coverage.",
  ]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    const reply = {
      role: "ai",
      content:
        "Thanks! I'm assembling insights from the live catalogue, warehouse inventory, associate bench, and fulfilment pipelines. (This is placeholder text — connect the AI endpoint to surface real responses.)",
    };
    setMessages((prev) => [...prev, newMessage, reply]);
    setHighlights((prev) => [
      ...prev,
      `⭐ ${input.slice(0, 80)}${input.length > 80 ? "…" : ""}`,
    ]);
    setInput("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-lg font-semibold tracking-[0.3em] text-slate-700 uppercase">
            Builtattic Assist
          </h1>
          <button
            onClick={() => setShowHighlights((prev) => !prev)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            showSidebar ? "block" : "hidden"
          } lg:block w-72 bg-white border-r border-slate-200 flex flex-col`}
        >
          <div className="px-6 py-6 border-b border-slate-100">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              sessions
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {history.map((item) => (
              <button
                key={item}
                className="w-full text-left text-sm bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-2 transition"
              >
                {item}
              </button>
            ))}
          </div>
          <Link
            to="/aisetting"
            className="m-6 bg-slate-900 text-white py-3 px-5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-800 transition shadow-sm"
          >
            <Settings size={16} /> Settings
          </Link>
        </aside>

        <section className="flex-1 flex flex-col">
          <header className="border-b border-slate-200 bg-white px-8 py-6 hidden lg:block">
            <p className="text-sm text-slate-500">
              Ask me to draft scopes, summarise deliverables, analyse catalogues, or
              pull procurement insights. I keep track of your workspace context.
            </p>
          </header>

          <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:border-slate-300 transition"
                >
                  <Lightbulb className="w-4 h-4 text-slate-400 mt-1" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-5 py-4 rounded-2xl max-w-3xl text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-slate-900 text-white rounded-br-sm"
                      : "bg-white text-slate-700 rounded-bl-sm border border-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <footer className="border-t border-slate-200 bg-white px-6 sm:px-10 py-6">
            <div className="flex gap-3 items-end">
              <textarea
                rows="2"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Ask Builtattic Assist anything…"
              />
              <button
                onClick={handleSend}
                className="bg-slate-900 text-white p-3 rounded-2xl shadow hover:bg-slate-800 transition"
              >
                <Send size={20} />
              </button>
            </div>
          </footer>
        </section>

        <aside
          className={`${
            showHighlights ? "block" : "hidden"
          } lg:block w-72 bg-white border-l border-slate-200 flex flex-col`}
        >
          <div className="px-6 py-6 border-b border-slate-100 flex items-center gap-2">
            <Sparkles size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Highlights
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-sm text-slate-600">
            {highlights.map((item) => (
              <div
                key={item}
                className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2"
              >
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Ai;
