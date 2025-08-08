import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive"
      });
      return;
    }

    onApiKeySet(apiKey.trim());
    toast({
      title: "API Key Set",
      description: "You can now start chatting with your AI assistant!",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-glow">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow">
              <Key className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">AI Voice Assistant</h1>
            <p className="text-muted-foreground">
              Enter your OpenAI API key to get started with voice-enabled conversations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-left block">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10 border-border/50 bg-background/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              Connect & Start Chatting
            </Button>
          </form>

          {/* Info */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-center justify-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Your API key is stored locally and never sent to our servers</span>
            </p>
            <p>
              Don't have an API key?{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get one from OpenAI
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};