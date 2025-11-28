'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.hello.queryOptions({
      text: 'lin',
    }),
  );
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      {JSON.stringify(data)}
    </div>
  );
}
