import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff, Share, ThumbsUp, ThumbsDown, RotateCcw, Play, Pause } from 'lucide-react';
import VoiceMessage from './VoiceMessage';

interface Message {
  id: string;
  type: 'text' | 'voice';
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  duration?: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: "Bacteria just discovered a plant that grows facility in the dark — naturally adapted growth. Scientists have found a species of cyanobacteria focused in Ayurvedic in Greece. While bioluminescence is common in fungi and bacteria, researchers say what's unique about this algae is how it night. Blog to shine Providing efficient illumination.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const responses = {
      crop: "Based on your soil conditions, I recommend growing wheat or barley. These crops are well-suited for your region's climate and soil type. Make sure to test soil pH and add organic matter if needed.",
      weather: "The weather forecast for your area shows moderate rainfall expected in the next 7 days. This is good for crop growth, but ensure proper drainage to prevent waterlogging.",
      fertilizer: "For optimal crop yield, I suggest using a balanced NPK fertilizer with ratio 10-10-10. Apply 50kg per acre during the growing season, split into 2-3 applications.",
      pest: "Common pests in your area include aphids and leaf miners. Use neem oil spray or beneficial insects like ladybugs for organic pest control. Monitor crops regularly for early detection.",
      market: "Current market prices for wheat: ₹2,100 per quintal. Demand is high due to recent exports. Consider selling 60% now and holding 40% for potential price increase next month."
    };

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('crop') || lowerQuery.includes('recommend')) return responses.crop;
    if (lowerQuery.includes('weather') || lowerQuery.includes('rain')) return responses.weather;
    if (lowerQuery.includes('fertilizer') || lowerQuery.includes('nutrient')) return responses.fertilizer;
    if (lowerQuery.includes('pest') || lowerQuery.includes('insect')) return responses.pest;
    if (lowerQuery.includes('market') || lowerQuery.includes('price')) return responses.market;
    
    return "I understand your farming query. As your AI agricultural assistant, I can help you with crop recommendations, weather forecasts, market prices, pest management, and fertilizer guidance. Please ask me specific questions about your farming needs.";
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic would go here
      setTimeout(() => {
        setIsRecording(false);
        // Add voice message
        const voiceMessage: Message = {
          id: Date.now().toString(),
          type: 'voice',
          content: 'Voice message recorded',
          sender: 'user',
          timestamp: new Date(),
          duration: 15
        };
        setMessages(prev => [...prev, voiceMessage]);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">MyKisan AI</h2>
        </div>
        <button className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
          <Share size={16} className="mr-1" />
          Share
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 mb-4">
          Tell me something new today
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border text-gray-900'
            }`}>
              {message.type === 'voice' ? (
                <VoiceMessage duration={message.duration || 0} />
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              
              {message.sender === 'ai' && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ThumbsUp size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ThumbsDown size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about farming, crops, weather, market prices..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;