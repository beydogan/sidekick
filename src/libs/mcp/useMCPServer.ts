import {useEffect, useRef, useState} from 'react';
import {MCPServerHandler} from './server';
import {ascTools} from './tools/asc';

interface MCPServerState {
  isRunning: boolean;
  port: number;
  error: string | null;
}

export function useMCPServer(autoStart = false) {
  const serverRef = useRef<MCPServerHandler | null>(null);
  const [state, setState] = useState<MCPServerState>({
    isRunning: false,
    port: 3000,
    error: null,
  });

  useEffect(() => {
    // Initialize server
    const server = new MCPServerHandler({
      name: 'sidekick',
      version: '1.0.0',
      port: 3000,
    });

    // Register ASC tools
    for (const {definition, handler} of ascTools) {
      server.registerTool(definition, handler);
    }

    serverRef.current = server;

    if (autoStart) {
      startServer();
    }

    return () => {
      server.stop();
    };
  }, []);

  const startServer = async () => {
    if (!serverRef.current) return;

    try {
      await serverRef.current.start();
      setState(prev => ({...prev, isRunning: true, error: null}));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Failed to start server',
      }));
    }
  };

  const stopServer = async () => {
    if (!serverRef.current) return;

    try {
      await serverRef.current.stop();
      setState(prev => ({...prev, isRunning: false, error: null}));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to stop server',
      }));
    }
  };

  return {
    ...state,
    start: startServer,
    stop: stopServer,
  };
}
