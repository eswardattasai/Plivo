import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { VoiceButton } from '@/components/ui/voice-button';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { LiveTranscription } from '@/components/ui/live-transcription';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Send, Settings, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { speak, stop, isSpeaking } = useTextToSpeech();

  const { isListening, toggleListening, isSupported: speechSupported } = useSpeechRecognition({
    onResult: handleVoiceResult,
    onInterimResult: (text: string) => {
      setLiveTranscript(text);
      setInput(text);
    },
    onError: (error) => {
      setLiveTranscript('');
      toast({
        title: "Voice Recognition Error",
        description: error,
        variant: "destructive"
      });
    }
  });

  async function handleVoiceResult(text: string) {
    setInput(text);
    await handleSendMessage(text);
  }

  async function handleSendMessage(messageText?: string) {
    const text = messageText || input.trim();
    if (!text) return;

    setLiveTranscript('');
    setInput('');
    setIsProcessing(true);

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: text })
      });

      if (!res.ok) {
        throw new Error('API Error');
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || 'No response'
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to connect to backend. Is it running?",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) stop();
    setSpeechEnabled(prev => !prev);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="p-4 mb-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Voice Assistant</h1>
              <p className="text-sm text-muted-foreground">
                {speechSupported ? 'Voice & text enabled' : 'Text only'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSpeech}
            className={cn("transition-colors", speechEnabled ? "text-voice-active" : "text-muted-foreground")}
          >
            {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex-1 p-4 mb-4 bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow">
                  <Send className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Start a conversation with your AI assistant</p>
                <p className="text-sm text-muted-foreground">
                  Type a message or {speechSupported && 'use voice input'}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatBubble key={msg.id} isUser={msg.role === 'user'}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </ChatBubble>
          ))}

          {isProcessing && (
            <ChatBubble>
              <TypingIndicator />
            </ChatBubble>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="border-border/50 bg-background/50"
            />
          </div>

          {speechSupported && (
            <VoiceButton
              isListening={isListening}
              isProcessing={isProcessing}
              onToggle={toggleListening}
            />
          )}

          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isProcessing}
            variant="default"
            size="lg"
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Live Transcription */}
      <LiveTranscription text={liveTranscript} isVisible={isListening && !!liveTranscript} />
    </div>
  );
};
