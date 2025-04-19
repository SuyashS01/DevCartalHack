
import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatbotModal } from "@/components/layout/ChatbotModal";

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const closeChat = () => {
    setIsOpen(false);
  };
  
  const hideButton = () => {
    setIsVisible(false);
  };
  
  if (!isVisible && !isOpen) return null;

  return (
    <>
      {!isOpen && isVisible && (
        <div className="fixed bottom-5 right-5 z-40 animate-fade-in">
          <div className="flex items-center mb-2">
            <div className="speech-bubble bg-primary text-primary-foreground p-3 rounded-lg rounded-br-none mr-2 animate-fade-in">
              <p className="text-sm">Need help finding issues to contribute to?</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={hideButton}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button 
            onClick={toggleChat}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
            size="icon"
          >
            <Bot className="h-7 w-7" />
          </Button>
        </div>
      )}
      
      <ChatbotModal isOpen={isOpen} onClose={closeChat} />
    </>
  );
}
