import dotenv from "dotenv";
import axios from "axios";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import createFolderTool from "./tools/createFolder.js";
import uploadImageTool from "./tools/uploadImage.js";
import getFolderContentsTool from "./tools/getFolderContents.js";

dotenv.config();

const api = axios.create({
  baseURL: process.env.MCP_API_BASE || "http://localhost:5000",
  headers: process.env.MCP_AUTH_TOKEN
    ? { Authorization: `Bearer ${process.env.MCP_AUTH_TOKEN}` }
    : {},
  withCredentials: false,
});

const server = new Server(
  { name: "dobby-ads-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [
    createFolderTool.definition,
    uploadImageTool.definition,
    getFolderContentsTool.definition,
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === createFolderTool.definition.name) {
    return createFolderTool.handler(api, args);
  }
  if (name === uploadImageTool.definition.name) {
    return uploadImageTool.handler(api, args);
  }
  if (name === getFolderContentsTool.definition.name) {
    return getFolderContentsTool.handler(api, args);
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
