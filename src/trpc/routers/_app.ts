import { messageRouter } from '@/modules/messages/server/procedures';
import { projectRouter } from '@/modules/project/server/procedures';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
