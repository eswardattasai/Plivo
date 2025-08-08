import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onToggle: () => void;
  className?: string;
}

export const VoiceButton = ({ isListening, isProcessing, onToggle, className }: VoiceButtonProps) => {
  const getIcon = () => {
    if (isProcessing) return <Square className="w-6 h-6" />;
    if (isListening) return <MicOff className="w-6 h-6" />;
    return <Mic className="w-6 h-6" />;
  };

  const getVariant = () => {
    if (isListening) return "listening";
    if (isProcessing) return "processing";
    return "voice";
  };

  return (
    <Button
      onClick={onToggle}
      variant={getVariant()}
      size="lg"
      className={cn(
        "rounded-full w-14 h-14 p-0 transition-all duration-300",
        isListening && "voice-pulse shadow-voice",
        isProcessing && "animate-pulse",
        className
      )}
    >
      {getIcon()}
    </Button>
  );
};