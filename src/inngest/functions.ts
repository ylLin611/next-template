import { Sandbox } from '@e2b/code-interpreter';
import { createAgent, openai } from '@inngest/agent-kit';
import { inngest } from './client';
import { getSandbox } from './utils';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('next-workspace-test');
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: 'writer',
      system: '你需要用一个词总结用户输入信息',
      model: openai({ model: process.env.OPENAI_MODEL ?? 'gpt-4o', baseUrl: process.env.OPENAI_BASE_URL }),
    });

    const { output } = await writer.run(event.data.value);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = await sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  },
);
