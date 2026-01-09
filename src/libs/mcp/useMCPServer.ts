import {useEffect, useRef, useState} from 'react';
import {MCPServerHandler} from './server';
import {ascTools} from './tools/asc';

interface MCPServerConfig {
  port?: number;
  autoStart?: boolean;
}

interface MCPServerState {
  isRunning: boolean;
  port: number;
  error: string | null;
}

export function useMCPServer(config: MCPServerConfig = {}) {
  const {port = 3000, autoStart = false} = config;
  const serverRef = useRef<MCPServerHandler | null>(null);
  const [state, setState] = useState<MCPServerState>({
    isRunning: false,
    port,
    error: null,
  });

  useEffect(() => {
    const server = new MCPServerHandler({
      name: 'sidekick',
      version: '1.0.0',
      port,
    });

    for (const {definition, handler} of ascTools) {
      server.registerTool(definition, handler);
    }

    serverRef.current = server;
    setState(prev => ({...prev, port}));

    if (autoStart) {
      startServer();
    }

    return () => {
      server.stop();
    };
  }, [port]);

  const startServer = async () => {
    if (!serverRef.current) return;

    try {
      await serverRef.current.start();
      setState(prev => ({...prev, isRunning: true, error: null}));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start server';
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: errorMessage,
      }));
    }
  };

  const stopServer = async () => {
    if (!serverRef.current) return;

    try {
      await serverRef.current.stop();
      setState(prev => ({...prev, isRunning: false, error: null}));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop server';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  return {
    ...state,
    start: startServer,
    stop: stopServer,
  };
}
