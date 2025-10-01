import React, { useState } from "react";
import { Send, Settings, History, Star, Menu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Ai = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(["Chat 1"]);
  const [highlights, setHighlights] = useState([
    "Important points will appear here",
  ]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const aiResponse = {
      role: "ai",
      content: "Kam krna h nhi bs AI se puchlo",
    };

    setMessages([...messages, newMessage, aiResponse]);
    setHighlights([...highlights, `⭐ ${input}`]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-stone-50 text-stone-900 overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-stone-200 bg-white">
        <button
          type="button"
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-light text-xl text-stone-800 tracking-wider">
          Builtattic
        </h1>
        <button
          type="button"
          onClick={() => setShowHighlights(!showHighlights)}
          className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition"
        >
          <Sparkles size={20} />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${showSidebar ? "block" : "hidden"} lg:block w-72 bg-white border-r border-stone-200 flex flex-col p-6 transition-all duration-300 ease-in-out`}
        >
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center text-lg font-medium text-stone-800 mb-6">
              <History size={20} className="mr-3 text-stone-500" /> History
            </div>
            {history.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-100 hover:bg-stone-200 p-3 rounded-lg text-sm cursor-pointer transition"
              >
                {item}
              </div>
            ))}
          </div>
          {/* CHANGE: Link styled as button (no nested Link inside button) */}
          <Link
            to="/aisetting"
            className="mt-110 bg-stone-900 text-white py-3 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 ease-in-out shadow-sm"
          >
            <Settings size={18} /> Settings
          </Link>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-5 py-3 rounded-xl max-w-xl shadow-md ${
                    msg.role === "user"
                      ? "bg-stone-900 text-white rounded-br-sm"
                      : "bg-white text-stone-800 rounded-bl-sm border border-stone-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-6 border-t border-stone-200 bg-white flex items-center gap-4">
            <input
              type="text"
              className="flex-1 border border-stone-300 rounded-full px-5 py-3 text-sm text-stone-700 focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none transition-all duration-300"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              className="bg-stone-900 p-3 rounded-full hover:bg-black transition-all duration-300 shadow-md"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Right Highlights */}
        <div
          className={`${
            showHighlights ? "block" : "hidden"
          } lg:block w-72 bg-white border-l border-stone-200 p-6 flex flex-col transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center text-lg font-medium text-stone-800 mb-6">
            <Sparkles size={20} className="mr-3 text-stone-500" /> Highlights
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 text-sm">
            {highlights.map((point, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-100 border border-stone-200 rounded-lg shadow-sm text-stone-700"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;
