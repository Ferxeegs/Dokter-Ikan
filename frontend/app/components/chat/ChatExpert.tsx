import { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";

interface Message {
  sender_role: string;
  message: string;
}

interface ChatExpertProps {
  consultationId: string;
}

export default function ChatExpert({ consultationId }: ChatExpertProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${consultationId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal mengambil pesan');
      }

      const data = await response.json();
      if (JSON.stringify(messages) !== JSON.stringify(data.data)) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [API_BASE_URL, consultationId, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultation_id: consultationId,
          sender_role: 'expert',
          message: newMessage,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal mengirim pesan');
      }

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1].message;
      if (lastMessage !== lastMessageRef.current) {
        lastMessageRef.current = lastMessage;
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    }
  }, [messages]);

  return (
    <div className="mt-10 p-4 border border-gray-300 rounded-lg bg-white shadow-lg max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 text-center mb-3">
        Chat Konsultasi
      </h2>

      <div
        ref={chatContainerRef}
        className="max-h-80 overflow-y-auto mb-4 border p-3 rounded-lg bg-gray-50"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender_role === "expert" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender_role === "expert"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-900 shadow-sm"
                  }`}
              >
                <span className="block font-bold text-xs mb-1">
                  {msg.sender_role === "expert" ? "Anda (Expert)" : "User"}
                </span>
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Belum ada pesan.</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="w-full border p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Ketik pesan..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Mengirim..." : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}