import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Search, FileText, MessageSquare, Send } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function Messages() {
  const { user } = useOutletContext();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/conversation/${otherUserId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user.user_id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await api.post('/messages', {
        receiver_id: selectedConversation.user.user_id,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedConversation.user.user_id);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="messages-page">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50">
              <h3 className="font-bold text-[#0F172A]">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.user.user_id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${
                      selectedConversation?.user.user_id === conv.user.user_id ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {conv.user.picture ? (
                        <img src={conv.user.picture} alt={conv.user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-bold">
                          {conv.user.name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0F172A] truncate">{conv.user.name}</p>
                        <p className="text-sm text-slate-600 truncate">
                          {conv.last_message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-600">
                  <p>No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b bg-slate-50">
                  <div className="flex items-center space-x-3">
                    {selectedConversation.user.picture ? (
                      <img
                        src={selectedConversation.user.picture}
                        alt={selectedConversation.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-bold">
                        {selectedConversation.user.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#0F172A]">{selectedConversation.user.name}</p>
                      <p className="text-sm text-slate-600">Recruiter</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      className={`flex ${msg.sender_id === user.user_id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender_id === user.user_id
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sending}
                    />
                    <Button
                      type="submit"
                      className="bg-[#4F46E5] hover:bg-[#4338CA]"
                      disabled={sending}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
