import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const projectRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return projects;
  }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, {
          message: 'id不能为空',
        }),
      }),
    )
    .query(async ({ input }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '项目不存在',
        });
      }
      return existingProject;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, {
          message: 'message不能为空',
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const newProject = await prisma.project.create({
        data: {
          name: '测试', // TODO,AI生成项目名称
          messages: {
            create: {
              content: input.value,
              role: 'USER',
              type: 'RESULT',
            },
          },
        },
      });

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: newProject.id,
        },
      });

      return newProject;
    }),
});
