"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { API_URL, api, unwrap } from "@/lib/api";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(API_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function useSocket() {
  const instance = useMemo(() => getSocket(), []);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!instance.connected) instance.connect();
    const update = () => forceRender((n) => n + 1);
    instance.on("connect", update);
    instance.on("disconnect", update);
    return () => {
      instance.off("connect", update);
      instance.off("disconnect", update);
    };
  }, [instance]);

  return instance;
}

export function useTypingIndicator(conversationId?: string, receiverId?: string) {
  const socketInstance = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    function onTyping(payload: { conversationId: string }) {
      if (payload.conversationId === conversationId) setIsTyping(true);
    }
    function onStopped(payload: { conversationId: string }) {
      if (payload.conversationId === conversationId) setIsTyping(false);
    }

    socketInstance.on("userTyping", onTyping);
    socketInstance.on("userStoppedTyping", onStopped);
    return () => {
      socketInstance.off("userTyping", onTyping);
      socketInstance.off("userStoppedTyping", onStopped);
    };
  }, [conversationId, socketInstance]);

  const sendTyping = useCallback(() => {
    if (conversationId && receiverId) socketInstance.emit("typing", { conversationId, receiverId });
  }, [conversationId, receiverId, socketInstance]);

  const stopTyping = useCallback(() => {
    if (conversationId && receiverId) socketInstance.emit("stoppedTyping", { conversationId, receiverId });
  }, [conversationId, receiverId, socketInstance]);

  return { isTyping, sendTyping, stopTyping };
}

export function useOnlineStatus(userIds: string[]) {
  const socketInstance = useSocket();
  const [onlineMap, setOnlineMap] = useState<Map<string, boolean>>(new Map());

  const query = useQuery({
    queryKey: ["chat", "online-status", userIds],
    enabled: userIds.length > 0,
    queryFn: async () =>
      unwrap<any>(await api.get("/api/chat/online-status", { params: { userIds: userIds.join(",") } })),
  });

  useEffect(() => {
    if (!query.data?.status) return;
    setOnlineMap(new Map(query.data.status.map((item: any) => [item.userId, Boolean(item.online)])));
  }, [query.data]);

  useEffect(() => {
    function online(payload: { userId: string }) {
      setOnlineMap((prev) => new Map(prev).set(payload.userId, true));
    }
    function offline(payload: { userId: string }) {
      setOnlineMap((prev) => new Map(prev).set(payload.userId, false));
    }
    socketInstance.on("userOnline", online);
    socketInstance.on("userOffline", offline);
    return () => {
      socketInstance.off("userOnline", online);
      socketInstance.off("userOffline", offline);
    };
  }, [socketInstance]);

  return onlineMap;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["chat", "unread-count"],
    queryFn: async () => unwrap<any>(await api.get("/api/chat/unread-count")),
    refetchInterval: 30_000,
  });
}
