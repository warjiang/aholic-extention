import { useState, FormEvent } from 'react';
import './App.css';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, convertToModelMessages, generateText } from 'ai';



function App() {
  const { messages, sendMessage, } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://127.0.0.1:3000/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  // Send message handler
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  console.log('messages', messages)
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Assistant</h2>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-bubble">
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
