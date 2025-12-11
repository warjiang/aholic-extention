import { useState, FormEvent } from 'react';
import './App.css';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: 'Hello! How can I assist you today?', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock API call for chat
  const sendChatMessage = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock response - replace with real API call
    return `You said: "${message}"`;
  };

  // Send message handler
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call chat API
      const response = await sendChatMessage(inputText);

      // Add bot response
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response,
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: 'Sorry, there was an error. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Assistant</h2>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-bubble">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-bubble">Thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={isLoading || !inputText.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
