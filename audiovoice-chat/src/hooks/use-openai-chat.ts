import { useState, useCallback } from 'react';
import OpenAI from 'openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UseOpenAIChatProps {
  apiKey: string;
}

export const useOpenAIChat = ({ apiKey }: UseOpenAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!apiKey) {
      setError('OpenAI API key is required');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage.content;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while sending the message';
      setError(errorMessage);
      console.error('OpenAI API Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error,
  };
};