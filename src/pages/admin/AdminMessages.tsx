import { useEffect, useState, useCallback } from 'react';
import { Mail, Check, Trash2, Loader2, X } from 'lucide-react';
import { supabase, type ContactMessage } from '@/lib/supabase';

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchMessages();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('contact_messages').delete().eq('id', deleteId);
    setDeleteId(null);
    setSelectedMessage(null);
    fetchMessages();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">Contact form submissions from your portfolio.</p>
      </div>

      {messages.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                !message.is_read ? 'border-l-2 border-l-[#6366f1]' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (!message.is_read) markAsRead(message.id);
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${message.is_read ? 'bg-white/5 text-zinc-600' : 'bg-[#6366f1]/10 text-[#6366f1]'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white truncate">{message.subject}</h3>
                    {!message.is_read && <span className="w-2 h-2 rounded-full bg-[#6366f1] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    From {message.name} &lt;{message.email}&gt;
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">{formatDate(message.created_at)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(message.id);
                  }}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMessage(null)}>
          <div className="glass rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{selectedMessage.subject}</h2>
              <button onClick={() => setSelectedMessage(null)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-zinc-500">From</p>
                <p className="text-sm text-white">{selectedMessage.name}</p>
                <a href={`mailto:${selectedMessage.email}`} className="text-sm text-[#6366f1] hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-2">Message</p>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white font-semibold text-sm rounded-lg hover:bg-[#4f46e5] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply
                </a>
                {!selectedMessage.is_read && (
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="glass rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Message?</h3>
            <p className="text-sm text-zinc-400 mb-6">This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
