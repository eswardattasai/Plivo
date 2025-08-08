import { cn } from "@/lib/utils";

interface LiveTranscriptionProps {
  text: string;
  isVisible: boolean;
  className?: string;
}

export const LiveTranscription = ({ text, isVisible, className }: LiveTranscriptionProps) => {
  if (!isVisible || !text) return null;

  return (
    <div className={cn(
      "fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50",
      "bg-voice-listening/90 backdrop-blur-sm text-white px-4 py-2 rounded-full",
      "shadow-voice border border-voice-listening/30",
      "animate-pulse transition-all duration-300",
      "max-w-xs md:max-w-md lg:max-w-lg",
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-white rounded-full voice-wave" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-4 bg-white rounded-full voice-wave" style={{ animationDelay: '100ms' }} />
          <div className="w-1 h-4 bg-white rounded-full voice-wave" style={{ animationDelay: '200ms' }} />
        </div>
        <span className="text-sm font-medium truncate">
          {text || "Listening..."}
        </span>
      </div>
    </div>
  );
};