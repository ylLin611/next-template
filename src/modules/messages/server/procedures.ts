import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const messageRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, {
          message: 'projectId不能为空',
        }),
      }),
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          updatedAt: 'asc',
        },
        include: {
          fragment: true,
        },
      });
      return messages;
    }),
  // 有project之后，这个方法不会被调用了
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, {
          message: 'message不能为空',
        }),
        projectId: z.string().min(1, {
          message: 'projectId不能为空',
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: 'USER',
          type: 'RESULT',
          projectId: input.projectId,
        },
      });

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return newMessage;
    }),
});
