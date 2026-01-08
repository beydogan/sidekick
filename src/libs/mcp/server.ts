import {NativeModules, NativeEventEmitter} from 'react-native';
import type {
  MCPRequest,
  MCPResponse,
  MCPError,
  ToolDefinition,
  ToolHandler,
  ServerInfo,
  ServerCapabilities,
  HTTPRequest,
} from './types';

const {MCPServer: NativeMCPServer} = NativeModules;

// MCP Error codes
const ErrorCodes = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
};

interface MCPServerOptions {
  name: string;
  version: string;
  port?: number;
}

export class MCPServerHandler {
  private tools: Map<string, {definition: ToolDefinition; handler: ToolHandler}> =
    new Map();
  private serverInfo: ServerInfo;
  private port: number;
  private eventEmitter: NativeEventEmitter;
  private isRunning = false;

  constructor(options: MCPServerOptions) {
    this.serverInfo = {
      name: options.name,
      version: options.version,
    };
    this.port = options.port ?? 3000;
    this.eventEmitter = new NativeEventEmitter(NativeMCPServer);
  }

  registerTool(
    definition: ToolDefinition,
    handler: ToolHandler,
  ): void {
    this.tools.set(definition.name, {definition, handler});
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[MCP] Server already running');
      return;
    }

    // Set up request handler
    this.eventEmitter.addListener('onRequest', this.handleHTTPRequest);
    this.eventEmitter.addListener('onError', (event: {error: string}) => {
      console.error('[MCP] Server error:', event.error);
    });

    try {
      await NativeMCPServer.start(this.port);
      this.isRunning = true;
      console.log(`[MCP] Server started on port ${this.port}`);
    } catch (error) {
      console.error('[MCP] Failed to start server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.eventEmitter.removeAllListeners('onRequest');
    this.eventEmitter.removeAllListeners('onError');

    await NativeMCPServer.stop();
    this.isRunning = false;
    console.log('[MCP] Server stopped');
  }

  private handleHTTPRequest = async (request: HTTPRequest) => {
    const {connectionId, method, path, body} = request;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      await this.sendResponse(connectionId, '', {});
      return;
    }

    // Only handle POST to /mcp
    if (method !== 'POST' || path !== '/mcp') {
      await this.sendErrorResponse(connectionId, null, {
        code: ErrorCodes.InvalidRequest,
        message: 'Invalid endpoint. Use POST /mcp',
      });
      return;
    }

    try {
      const mcpRequest: MCPRequest = JSON.parse(body);
      const response = await this.handleMCPRequest(mcpRequest);
      await this.sendResponse(connectionId, JSON.stringify(response), {});
    } catch (error) {
      await this.sendErrorResponse(connectionId, null, {
        code: ErrorCodes.ParseError,
        message: 'Failed to parse request',
      });
    }
  };

  private async handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
    const {id, method, params} = request;

    switch (method) {
      case 'initialize':
        return this.handleInitialize(id);

      case 'tools/list':
        return this.handleToolsList(id);

      case 'tools/call':
        return await this.handleToolCall(id, params as {name: string; arguments?: Record<string, unknown>});

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: ErrorCodes.MethodNotFound,
            message: `Method not found: ${method}`,
          },
        };
    }
  }

  private handleInitialize(id: string | number): MCPResponse {
    const capabilities: ServerCapabilities = {
      tools: {
        listChanged: false,
      },
    };

    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: this.serverInfo,
        capabilities,
      },
    };
  }

  private handleToolsList(id: string | number): MCPResponse {
    const tools = Array.from(this.tools.values()).map(t => t.definition);

    return {
      jsonrpc: '2.0',
      id,
      result: {tools},
    };
  }

  private async handleToolCall(
    id: string | number,
    params?: {name: string; arguments?: Record<string, unknown>},
  ): Promise<MCPResponse> {
    if (!params?.name) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: ErrorCodes.InvalidParams,
          message: 'Missing tool name',
        },
      };
    }

    const tool = this.tools.get(params.name);
    if (!tool) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: ErrorCodes.MethodNotFound,
          message: `Tool not found: ${params.name}`,
        },
      };
    }

    try {
      const result = await tool.handler(params.arguments ?? {});
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: ErrorCodes.InternalError,
          message: error instanceof Error ? error.message : 'Tool execution failed',
        },
      };
    }
  }

  private async sendResponse(
    connectionId: string,
    body: string,
    headers: Record<string, string>,
  ): Promise<void> {
    try {
      await NativeMCPServer.sendResponse(connectionId, body, headers);
    } catch (error) {
      console.error('[MCP] Failed to send response:', error);
    }
  }

  private async sendErrorResponse(
    connectionId: string,
    id: string | number | null,
    error: MCPError,
  ): Promise<void> {
    const response: MCPResponse = {
      jsonrpc: '2.0',
      id: id ?? 0,
      error,
    };
    await this.sendResponse(connectionId, JSON.stringify(response), {});
  }
}
