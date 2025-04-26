import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export function useWebSocket(userId: number | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!userId || isConnecting || wsRef.current) return;
    
    setIsConnecting(true);
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Send authentication message
      socket.send(JSON.stringify({ 
        type: 'auth', 
        userId 
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle auth confirmation
        if (message.type === 'auth_success') {
          setIsConnected(true);
          setIsConnecting(false);
        } 
        // Handle messages
        else if (message.type === 'new_message') {
          // Add to messages state
          setMessages(prev => [...prev, message]);
          
          // Show notification toast for new messages
          toast({
            title: 'New Message',
            description: `You have received a new message`,
          });
        }
        // Handle other message types
        else {
          setMessages(prev => [...prev, message]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      setIsConnecting(false);
      wsRef.current = null;
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to chat service',
        variant: 'destructive',
      });
      setIsConnecting(false);
      wsRef.current = null;
    };
    
  }, [userId, isConnecting, toast]);
  
  // Send a message through WebSocket
  const sendMessage = useCallback((receiverId: number, content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !userId) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to chat service',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        senderId: userId,
        receiverId,
        content
      }));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, [userId, toast]);
  
  // Connect on component mount if userId is available
  useEffect(() => {
    if (userId) {
      connect();
    }
    
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [userId, connect]);
  
  return {
    isConnected,
    isConnecting,
    messages,
    sendMessage,
    connect,
  };
}