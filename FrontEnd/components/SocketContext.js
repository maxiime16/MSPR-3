// SocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { IP_socket } from './const';

const SocketContext = createContext(null);

export const SocketProvider = ({ children, token }) => {
    useEffect(() => {
        const socket = io(IP_socket, {
            query: { token },
            autoConnect: false
        });

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
