import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { IP_socket } from '../components/const';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = io(IP_socket, { autoConnect: false });

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
