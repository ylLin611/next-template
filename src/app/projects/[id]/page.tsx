import { ProjectView } from '@/modules/project/ui/views/project-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();
  // 数据预获取
  void queryClient.prefetchQuery(
    trpc.messages.list.queryOptions({
      projectId: id,
    }),
  );

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      id,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
