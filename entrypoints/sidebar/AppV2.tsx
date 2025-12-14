import '../styles/tailwind.css';
import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tag } from '~/components/ui/tag';

// Initialize WebSocket connection
const socket = io('http://127.0.0.1:3000', {
  path: '/events',
});

// Message interface
interface Message {
  id: number;
  content: string;
  isUser: boolean;
}
const cwd = '/Users/dingwenjiang/workspace/codereview/warjiang/imagewave'
const sessionId = 'cfa6de18-baa2-4381-8317-859cc00f2355'

let cnt = 0;
let cnt2 = 0
function AppV2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for copied elements from content script
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const [copiedElements, setCopiedElements] = useState<any[]>([]);

  // Listen for messages from content script
  useEffect(() => {
    if(cnt2 != 0) return
    cnt2++;
    const handleMessage = (message: any) => {
      console.log('receive content script', message)
      if (message.type === "REACT_GRAB_ELEMENTS_COPIED") {
        setCopiedContent(message.content);
        // Append new elements to existing ones and deduplicate using outerHTML as unique identifier
        setCopiedElements(prev => {
          const combined = [...prev, ...message.elements];
          // Use outerHTML as unique key to avoid duplicates
          return [...new Map(combined.map(el => [el.outerHTML, el])).values()];
        });
        // You can also send this to the WebSocket if needed
        /*
        socket.emit('query', {
          type: 'copied_elements',
          content: message.content,
          elements: message.elements,
          cwd,
          sessionId,
        });
        */
      }
    };

    // Add message listener
    browser.runtime.onMessage.addListener(handleMessage);

    // Clean up listener on unmount
    // return () => {
    //   browser.runtime.onMessage.removeListener(handleMessage);
    // };
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle WebSocket connect
  useEffect(() => {
    if(cnt != 0) return;
    cnt ++;
    socket.on('connect', () => {
      console.log('Connected to WebSocket');

      // Add a welcome message
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: 'Connected! You can now send messages.',
        isUser: false
      }]);
    });

    // Handle incoming messages
    socket.on('events', (data) => {
      console.log('Received message:', data);

      // Add received message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.content || 'Received a message',
        isUser: false
      }]);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: 'Disconnected from server.',
        isUser: false
      }]);
    });

    return () => {
      // socket.off('connect');
      // socket.off('events');
      // socket.off('disconnect');
    };
  }, []);

  // sendMessage hook - the "button" you can customize
  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      content,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to WebSocket
    socket.emit('query', { 
      type: 'message', 
      content: content,
      cwd,
      sessionId,
    });

    // Clear input
    setInputValue('');
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  // console.log('copiedElements', copiedElements)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Chat Interface</h1>
      </div>

      {/* Copied Elements Display */}
      {copiedContent && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-800">Selected Elements:</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCopiedContent(null);
                setCopiedElements([]);
              }}
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {copiedElements.map((element, index) => {
              // console.log('element', element)
              // Use serializable element data directly
              const tagName = (element.tagName || 'ELEMENT').toLowerCase();
              const id = element.id;
              const className = element.className?.toString().split(' ')[0] || '';

              // Build tag content
              let tagContent = tagName;
              if (id) {
                tagContent += `#${id}`;
              }
              if (className) {
                tagContent += `.${className}`;
              }

              return (
                <Tag
                  key={index}
                  variant="default"
                >
                  {tagContent}
                </Tag>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}

export default AppV2;
