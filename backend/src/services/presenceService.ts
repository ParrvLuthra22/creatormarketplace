export const onlineUsers = new Map<string, Set<string>>();

export function addOnlineSocket(userId: string, socketId: string): boolean {
    const sockets = onlineUsers.get(userId) || new Set<string>();
    const wasOffline = sockets.size === 0;
    sockets.add(socketId);
    onlineUsers.set(userId, sockets);
    return wasOffline;
}

export function removeOnlineSocket(userId: string, socketId: string): boolean {
    const sockets = onlineUsers.get(userId);
    if (!sockets) {
        return false;
    }

    sockets.delete(socketId);
    if (sockets.size === 0) {
        onlineUsers.delete(userId);
        return true;
    }

    return false;
}

export function isUserOnline(userId: string): boolean {
    return (onlineUsers.get(userId)?.size || 0) > 0;
}
