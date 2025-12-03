import { prisma } from '@/lib/db';
import { PROMPT } from '@/prompt';
import { Sandbox } from '@e2b/code-interpreter';
import { createAgent, createNetwork, createTool, openai, Tool } from '@inngest/agent-kit';
import z from 'zod';
import { inngest } from './client';
import { getSandbox, lastAssistantTextMessageContent } from './utils';

interface AgentState {
  summary: string;
  files: {
    [path: string]: string;
  };
}

export const codeAgentFunction = inngest.createFunction(
  { id: 'code-agent' },
  { event: 'code-agent/run' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('next-workspace-test');
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent<AgentState>({
      name: 'code-agent',
      description: '高级软件工程师',
      system: PROMPT,
      model: openai({
        model: process.env.OPENAI_MODEL ?? 'gpt-5',
        baseUrl: process.env.OPENAI_BASE_URL,
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: 'terminal',
          description: '在终端中执行命令',
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' };
              try {
                const sandbox = await getSandbox(sandboxId);
                // sandbox run command
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                const errMsg = `Command错误：${error} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`;
                console.error(errMsg);
                return errMsg;
              }
            });
          },
        }),
        createTool({
          name: 'createOrUpdateFiles',
          description: '在sandbox中创建或更新文件',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            const newFiles = await step?.run('createOrUpdateFiles', async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (error) {
                return `Error: ${error}`;
              }
            });
            if (typeof newFiles === 'object') {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: 'readFiles',
          description: '读取sandbox中的文件',
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents: { path: string; content: string }[] = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return `Error: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes('<task_summary>')) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: 'code-agent-network',
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);

    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = await sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run('save-result', async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: 'Something is wrong, please tru again！',
            type: 'ERROR',
            role: 'ASSISTANT',
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          type: 'RESULT',
          role: 'ASSISTANT',
          fragment: {
            create: {
              sandboxUrl,
              title: 'Fragment',
              files: result.state.data.files || {},
            },
          },
        },
      });
    });

    return {
      sandboxUrl,
      title: 'Fragment',
      files: result.state.data.files || {},
      summary: result.state.data.summary || '',
    };
  },
);
