'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [text, setText] = useState('');

  const trpc = useTRPC();

  const router = useRouter();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success('创建Project成功');
        router.push(`/projects/${data.id}`);
      },
    }),
  );
  const handleInvoke = () => {
    createProject.mutate({ value: text });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} />
        <Button disabled={createProject.isPending} onClick={handleInvoke}>
          Click me
        </Button>
      </div>
    </div>
  );
}
