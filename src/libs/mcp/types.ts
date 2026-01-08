// MCP Protocol Types
// Based on Model Context Protocol specification

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface MCPNotification {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
}

// Tool definitions
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
}

export interface PropertySchema {
  type: string;
  description?: string;
  enum?: string[];
}

export interface ToolHandler {
  (params: Record<string, unknown>): Promise<unknown>;
}

// Server info
export interface ServerInfo {
  name: string;
  version: string;
}

export interface ServerCapabilities {
  tools?: {
    listChanged?: boolean;
  };
}

// HTTP Request from native module
export interface HTTPRequest {
  connectionId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: string;
}
