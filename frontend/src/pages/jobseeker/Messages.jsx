import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Clock3,
  Home,
  Inbox,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  User,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
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
      if (response.data.length > 0 && !selectedConversation) {
        handleSelectConversation(response.data[0]);
      }
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
      fetchConversations();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const conversationCount = conversations.length;
  const messageCount = messages.length;

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="messages-page">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Candidate communication
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Stay close to recruiters in a calmer, cleaner inbox.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Track conversations, respond quickly, and keep your job search momentum without leaving the Naya Job workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Open conversations</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{conversationCount}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Selected thread</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{selectedConversation ? messageCount : 0}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Inbox mode</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">Premium clarity</div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Conversation history, recruiter context, and replies stay organized in one focused surface.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="premium-panel overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <DashboardSectionHeader
                eyebrow="Inbox"
                title="Conversations"
                description="Review active recruiter threads and open one to continue."
              />
            </div>

            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-accent"></div>
                </div>
              ) : conversationCount > 0 ? (
                <div className="divide-y divide-slate-200">
                  {conversations.map((conv) => {
                    const isActive = selectedConversation?.user.user_id === conv.user.user_id;

                    return (
                      <button
                        key={conv.user.user_id}
                        type="button"
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full px-5 py-4 text-left transition-colors ${
                          isActive ? 'bg-violet-50/80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {conv.user.picture ? (
                            <img src={conv.user.picture} alt={conv.user.name} className="h-11 w-11 rounded-full ring-2 ring-slate-100" />
                          ) : (
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full font-bold text-white ${isActive ? 'bg-accent' : 'bg-slate-900'}`}>
                              {conv.user.name[0]}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-950">{conv.user.name}</p>
                                <p className="mt-1 truncate text-sm text-slate-600">{conv.last_message.content}</p>
                              </div>
                              <div className="shrink-0 text-[11px] font-medium text-slate-400">
                                {new Date(conv.last_message.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">No conversations yet</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Once recruiters message you, they will appear here in a cleaner inbox flow.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="premium-panel overflow-hidden">
            {selectedConversation ? (
              <div className="flex h-[calc(100vh-220px)] min-h-[680px] flex-col">
                <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5">
                  <div className="flex items-center gap-3">
                    {selectedConversation.user.picture ? (
                      <img
                        src={selectedConversation.user.picture}
                        alt={selectedConversation.user.name}
                        className="h-12 w-12 rounded-full ring-2 ring-white"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-white">
                        {selectedConversation.user.name[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-lg font-heading font-bold text-slate-950">{selectedConversation.user.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-accent" />
                          Recruiter conversation
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-4 w-4" />
                          Active thread
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,1))] px-6 py-6">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isMine = msg.sender_id === user.user_id;

                        return (
                          <div
                            key={msg.message_id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[78%] rounded-[1.5rem] px-4 py-3 shadow-sm ${
                                isMine
                                  ? 'bg-accent text-white'
                                  : 'border border-slate-200 bg-white text-slate-900'
                              }`}
                            >
                              <p className="text-sm leading-7">{msg.content}</p>
                              <p className={`mt-2 text-[11px] ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-md text-center">
                        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">No messages in this thread yet</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Start the conversation with a clear reply and keep the hiring process moving.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white px-6 py-5">
                  <div className="flex items-end gap-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a clear, professional reply..."
                      disabled={sending}
                      className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4"
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      size="xl"
                      className="shrink-0"
                      disabled={sending}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-220px)] min-h-[680px] items-center justify-center px-6 py-10">
                <div className="max-w-md text-center">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-2xl font-heading font-bold text-slate-950">Select a conversation</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Open a recruiter thread from the inbox to review message history and send your next reply.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
