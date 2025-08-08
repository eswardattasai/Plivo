import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChatBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  isTyping?: boolean;
  className?: string;
}

export const ChatBubble = ({ children, isUser = false, isTyping = false, className }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-message message-enter",
        "transition-all duration-300 ease-smooth",
        isUser 
          ? "bg-gradient-primary text-primary-foreground ml-4" 
          : "bg-card text-card-foreground mr-4",
        isTyping && "typing-indicator"
      )}>
        {children}
      </div>
    </div>
  );
};