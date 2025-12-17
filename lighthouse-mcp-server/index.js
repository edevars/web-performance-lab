import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import lighthouse from "lighthouse"; // lighthouse is an ESM module
import * as chromeLauncher from "chrome-launcher";
import fs from "fs/promises";
import path from "path";

const server = new Server(
  {
    name: "lighthouse-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_lighthouse_audit",
        description: "Runs a Google Lighthouse audit on a specific URL. Returns scores and saves a JSON report.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The URL to audit (e.g., http://localhost:5173)",
            },
            categories: {
              type: "array",
              items: {
                type: "string",
                enum: ["performance", "accessibility", "best-practices", "seo", "pwa"],
              },
              description: "List of audit categories to run. Defaults to all.",
            },
            outputPath: {
                type: "string",
                description: "Optional path to save the JSON report. Defaults to ./report-[timestamp].json"
            }
          },
          required: ["url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "run_lighthouse_audit") {
    const url = request.params.arguments.url;
    const categories = request.params.arguments.categories || ["performance", "accessibility", "best-practices", "seo", "pwa"];
    const outputPath = request.params.arguments.outputPath || `report-${Date.now()}.json`;

    try {
        const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: categories,
            port: chrome.port
        };
        
        const runnerResult = await lighthouse(url, options);
        await chrome.kill();

        const report = runnerResult.lhr;
        const scores = Object.values(report.categories).map(c => `${c.title}: ${(c.score * 100).toFixed(0)}`).join('\n');

        // Save report to disk
        await fs.writeFile(outputPath, runnerResult.report);

        return {
            content: [
                {
                    type: "text",
                    text: `Lighthouse Audit for ${url} completed.\n\nScores:\n${scores}\n\nReport saved to: ${outputPath}`
                }
            ]
        };

    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error running lighthouse: ${error instanceof Error ? error.message : String(error)}`
                }
            ],
            isError: true
        }
    }
  }

  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
