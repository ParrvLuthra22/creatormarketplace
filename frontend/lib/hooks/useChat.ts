"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { getSocket, useSocket } from "@/lib/socket";

export function useConversations() {
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: async () => unwrap<any>(await api.get("/api/chat/conversations")),
  });
}

export function useMessages(conversationId?: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [liveMessages, setLiveMessages] = useState<any[]>([]);

  const query = useQuery({
    queryKey: ["chat", "messages", conversationId],
    enabled: Boolean(conversationId),
    queryFn: async () => unwrap<any>(await api.get(`/api/chat/${conversationId}`)),
  });

  useEffect(() => {
    setLiveMessages(query.data?.messages || []);
  }, [query.data]);

  useEffect(() => {
    function onNewMessage(message: any) {
      if (String(message.conversationId) !== String(conversationId)) return;
      setLiveMessages((prev) =>
        prev.some((m) => String(m._id) === String(message._id)) ? prev : [...prev, message]
      );
      queryClient.invalidateQueries({ queryKey: ["chat", "unread-count"] });
    }
    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [conversationId, queryClient, socket]);

  return { ...query, data: { messages: liveMessages } };
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (payload: {
      conversationId: string;
      receiverId: string;
      text?: string;
      attachments?: any[];
      replyTo?: string;
    }) =>
      new Promise<any>((resolve, reject) => {
        getSocket().emit("sendMessage", payload, (response: any) => {
          if (response?.success) resolve(response);
          else reject(new Error(response?.error || "Failed to send message"));
        });
      }),
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: async (payload: { conversationId: string; senderId: string }) => {
      getSocket().emit("markAsRead", payload);
      return payload;
    },
  });
}

export function useAddReaction() {
  return useMutation({
    mutationFn: async (payload: { messageId: string; emoji: string }) =>
      new Promise<any>((resolve, reject) => {
        getSocket().emit("addReaction", payload, (response: any) => {
          if (response?.success) resolve(response);
          else reject(new Error(response?.error || "Failed to add reaction"));
        });
      }),
  });
}

export function useRemoveReaction() {
  return useMutation({
    mutationFn: async (payload: { messageId: string }) =>
      new Promise<any>((resolve, reject) => {
        getSocket().emit("removeReaction", payload, (response: any) => {
          if (response?.success) resolve(response);
          else reject(new Error(response?.error || "Failed to remove reaction"));
        });
      }),
  });
}

/** Listens for reactionAdded/reactionRemoved socket events and returns a live map of messageId -> reactions. */
export function useMessageReactions(messages: any[]) {
  const socket = useSocket();
  const [reactions, setReactions] = useState<Map<string, { userId: string; emoji: string }[]>>(new Map());

  useEffect(() => {
    setReactions(new Map(messages.map((m) => [String(m._id), m.reactions || []])));
  }, [messages]);

  useEffect(() => {
    function onAdded(payload: { messageId: string; userId: string; emoji: string }) {
      setReactions((prev) => {
        const next = new Map(prev);
        const existing = (next.get(payload.messageId) || []).filter((r) => r.userId !== payload.userId);
        next.set(payload.messageId, [...existing, { userId: payload.userId, emoji: payload.emoji }]);
        return next;
      });
    }
    function onRemoved(payload: { messageId: string; userId: string }) {
      setReactions((prev) => {
        const next = new Map(prev);
        const existing = (next.get(payload.messageId) || []).filter((r) => r.userId !== payload.userId);
        next.set(payload.messageId, existing);
        return next;
      });
    }
    socket.on("reactionAdded", onAdded);
    socket.on("reactionRemoved", onRemoved);
    return () => {
      socket.off("reactionAdded", onAdded);
      socket.off("reactionRemoved", onRemoved);
    };
  }, [socket]);

  return reactions;
}
