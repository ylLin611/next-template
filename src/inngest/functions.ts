import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    // 模拟视频读取
    await step.sleep('wait-a-moment', '10s');
    // 模拟视频处理
    await step.sleep('wait-a-moment', '10s');
    // 模拟大模型处理
    await step.sleep('wait-a-moment', '10s');
    return { message: `Hello ${event.data.email}!` };
  },
);
