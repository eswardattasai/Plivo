import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { ApiKeySetup } from '@/components/ApiKeySetup';

const Index = () => {

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* {!apiKey ? (
        <ApiKeySetup onApiKeySet={handleApiKeySet} />
      ) : ( */}
        <ChatInterface  />
      {/* )} */}
    </div>
  );
};

export default Index;
