"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeSocket = async () => {
      console.log('Initializing socket server...');
      
      // First, call the API route to initialize the Socket.IO server
      try {
        await fetch('/api/socket');
        console.log('Socket server initialized');
      } catch (error) {
        console.error('Failed to initialize socket server:', error);
      }

      // Small delay to ensure server is ready
      setTimeout(() => {
        console.log('Connecting to socket...');
        
        const socket = io({
          path: "/api/socket",
          transports: ["websocket", "polling"],
          forceNew: true,
        });
        
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log('Socket connected:', socket.id);
          setConnected(true);
        });
        
        socket.on("disconnect", () => {
          console.log('Socket disconnected');
          setConnected(false);
        });

        socket.on("connect_error", (error) => {
          console.error('Socket connection error:', error);
        });
      }, 500);
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}; 