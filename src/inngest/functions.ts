import { createAgent, openai } from '@inngest/agent-kit';
import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event }) => {
    const writer = createAgent({
      name: 'writer',
      system: '你需要用一个词总结用户输入信息',
      model: openai({ model: process.env.OPENAI_MODEL ?? 'gpt-4o', baseUrl: process.env.OPENAI_BASE_URL }),
    });

    const { output } = await writer.run(event.data.value);

    return { message: output };
  },
);
