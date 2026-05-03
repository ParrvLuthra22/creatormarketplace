"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { useConversations, useMessages, useSendMessage } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/auth";

export default function BrandMessagesPage() {
  const user = useAuthStore((state) => state.user);
  const conversations = useConversations();
  const [activeId, setActiveId] = useState<string | undefined>();
  const activeConversation = useMemo(() => {
    const list = conversations.data?.conversations || [];
    return list.find((item: any) => item._id === activeId) || list[0];
  }, [activeId, conversations.data]);
  const messages = useMessages(activeConversation?._id);
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");

  const receiver = activeConversation?.participants?.find((p: any) => String(p._id) !== String(user?.id || user?._id));

  async function send() {
    if (!text.trim() || !activeConversation || !receiver) return;
    await sendMessage.mutateAsync({
      conversationId: activeConversation._id,
      receiverId: receiver._id,
      text,
    });
    setText("");
  }

  return (
    <div className="grid h-full min-h-[620px] grid-cols-[320px_1fr] overflow-hidden rounded-2xl border border-(--border) bg-(--bg-secondary)">
      <aside className="border-r border-(--border) overflow-auto">
        <div className="p-4 border-b border-(--border)">
          <h1 className="font-display text-h3">Messages</h1>
        </div>
        {(conversations.data?.conversations || []).map((conversation: any) => {
          const other = conversation.participants?.find((p: any) => String(p._id) !== String(user?.id || user?._id));
          return (
            <button key={conversation._id} onClick={() => setActiveId(conversation._id)} className={`w-full p-4 text-left border-b border-(--border) ${activeConversation?._id === conversation._id ? "bg-(--bg-surface)" : ""}`}>
              <p className="font-semibold">{other?.fullName || "Conversation"}</p>
              <p className="text-sm text-(--text-tertiary) truncate">{conversation.lastMessage || "No messages yet"}</p>
            </button>
          );
        })}
      </aside>
      <section className="flex min-w-0 flex-col">
        <div className="border-b border-(--border) p-4">
          <p className="font-semibold">{receiver?.fullName || "Select a conversation"}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {(messages.data?.messages || []).map((message: any) => {
            const mine = String(message.senderId) === String(user?.id || user?._id);
            return (
              <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-(--accent) text-(--bg-primary)" : "bg-(--bg-surface)"}`}>
                  {message.text}
                  {message.attachments?.length > 0 && <p className="mt-1 text-xs opacity-70">{message.attachments.length} attachment(s)</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 border-t border-(--border) p-4">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void send(); }} placeholder="Write a message" className="h-11 flex-1 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
          <button onClick={send} className="h-11 w-11 rounded-xl bg-(--accent) text-(--bg-primary) grid place-items-center">
            <Send size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
