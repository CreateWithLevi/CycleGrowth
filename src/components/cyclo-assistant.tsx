"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { getCycloStage, CycloStage } from "./cyclo-evolution-stages";

interface CycloAssistantProps {
  stage?: CycloStage;
  initialMessage?: string;
  onUpgrade?: () => void;
}

export default function CycloAssistant({
  stage = 1,
  initialMessage = "Hi there! I'm Cyclo, your CycleGrowth assistant. How can I help you today?",
  onUpgrade,
}: CycloAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: initialMessage },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const cycloStage = getCycloStage(stage);

  useEffect(() => {
    // Show upgrade prompt after 3 messages if not at max stage
    if (messages.length > 6 && stage < 4 && !showUpgradePrompt) {
      setShowUpgradePrompt(true);
    }
  }, [messages.length, stage, showUpgradePrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      let response =
        "I'm still learning to respond to that. As I evolve, I'll be able to provide more personalized guidance.";

      // Different responses based on stage
      if (stage >= 2 && inputValue.toLowerCase().includes("goal")) {
        response =
          "I notice you're talking about goals. Would you like me to help you break that down into actionable steps? Based on your current growth cycle, I can suggest some specific milestones.";
      }

      if (stage >= 3 && inputValue.toLowerCase().includes("stuck")) {
        response =
          "I've analyzed your progress patterns, and I notice you tend to make the most progress in the mornings. Would you like to adjust your schedule to leverage this insight? I can also suggest some specific techniques to overcome your current roadblock.";
      }

      if (stage >= 4 && inputValue.toLowerCase().includes("next")) {
        response =
          "Based on your current progress and past cycles, I predict you'll face a challenge with consistency next week. I've noticed this pattern in your previous cycles. Would you like me to suggest some preventative strategies tailored to your specific working style?";
      }

      // Add more domain-specific responses
      if (
        inputValue.toLowerCase().includes("professional") ||
        inputValue.toLowerCase().includes("work")
      ) {
        if (stage >= 3) {
          response =
            "I see you're focusing on professional development. Based on your previous cycles, you've made significant progress in communication skills but might benefit from more structured practice in leadership scenarios. Would you like me to suggest some specific exercises?";
        } else {
          response =
            "Professional development is a great focus area. I recommend breaking down your goals into specific skills you want to develop. Would you like to create a new growth cycle for this?";
        }
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }, 1500);

    setInputValue("");
  };

  const handleUpgrade = () => {
    setShowUpgradePrompt(false);
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Add a message about upgrading
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "To access more advanced capabilities, you can upgrade to the next Cyclo evolution stage. This will unlock more personalized guidance and advanced features.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0 bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo}`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div
            className={`p-3 border-b flex items-center justify-between bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo} text-white`}
          >
            <div className="flex items-center gap-2">
              {cycloStage.icon}
              <div>
                <span className="font-medium">{cycloStage.title}</span>
                <div className="text-xs text-white/80">{cycloStage.name}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? `bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo} text-white`
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {showUpgradePrompt && stage < 4 && (
              <div className="flex justify-center my-4">
                <div className="p-3 rounded-lg border border-dashed border-purple-300 bg-purple-50 max-w-[90%]">
                  <div className="flex items-center gap-2 text-sm text-purple-700 mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Upgrade Available</span>
                  </div>
                  <p className="text-xs text-purple-600 mb-2">
                    Unlock more advanced capabilities by upgrading to{" "}
                    {getCycloStage((stage + 1) as CycloStage).title}.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleUpgrade}
                    className={`w-full text-xs bg-gradient-to-r ${getCycloStage((stage + 1) as CycloStage).gradientFrom} ${getCycloStage((stage + 1) as CycloStage).gradientTo}`}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Capabilities */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Capabilities:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {cycloStage.capabilities.slice(0, 3).map((capability, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-gray-200 rounded-full"
                >
                  {capability}
                </span>
              ))}
              {cycloStage.capabilities.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                  +{cycloStage.capabilities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Cyclo anything..."
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className={`bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo}`}
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
