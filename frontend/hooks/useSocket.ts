"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

let socketInstance: Socket | null = null;
let connectionCount = 0;

export function useSocket() {
    const { isAuthenticated, authToken } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(socketInstance);
    const [connected, setConnected] = useState(socketInstance?.connected || false);

    useEffect(() => {
        if (!isAuthenticated) {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance = null;
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                auth: authToken ? { token: authToken } : undefined,
            });
        }
        
        setSocket(socketInstance);
        connectionCount++;

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);
        const onConnectError = (error: any) => {
            console.error('Socket connection error:', error);
            setConnected(false);
        };

        socketInstance.on('connect', onConnect);
        socketInstance.on('disconnect', onDisconnect);
        socketInstance.on('connect_error', onConnectError);

        // If it was already connected before this component mounted
        setConnected(socketInstance.connected);

        return () => {
            connectionCount--;
            if (socketInstance) {
                socketInstance.off('connect', onConnect);
                socketInstance.off('disconnect', onDisconnect);
                socketInstance.off('connect_error', onConnectError);
                
                // Disconnect if no components are using the socket
                if (connectionCount === 0) {
                    socketInstance.disconnect();
                    socketInstance = null;
                }
            }
        };
    }, [isAuthenticated, authToken]);

    return { socket, connected };
}
