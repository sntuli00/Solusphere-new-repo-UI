import React, { useState, useRef, useEffect } from "react";
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm SIA (Smart Intelligence Assistant). How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/chatbot",
        { message: userMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Add assistant response to chat
      if (res.data && res.data.reply) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: res.data.reply }
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.response?.data?.error || 
                          "I apologize, but I'm having trouble processing your request. Please try again.";
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="card bg-gradient-to-r from-primary to-accent-purple text-white mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Chatbot (SIA)</h2>
              <p className="text-white/90 mt-1">
                Smart Intelligence Assistant - Ask me anything!
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="card flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-accent-purple"
                      : "bg-gradient-to-r from-secondary to-accent-blue"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  ) : (
                    <SparklesIcon className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-accent-purple text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent-blue flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}