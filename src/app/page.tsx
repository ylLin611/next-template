'use client';

import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [text, setText] = useState('');

  const trpc = useTRPC();

  const { data: messages } = useQuery(trpc.messages.list.queryOptions());

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success('创建Message成功');
      },
    }),
  );
  const handleInvoke = () => {
    createMessage.mutate({ value: text });
  };

  return (
    <div className="">
      <ThemeToggler></ThemeToggler>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      <Button disabled={createMessage.isPending} onClick={handleInvoke}>
        Click me
      </Button>
      <div>{JSON.stringify(messages)}</div>
    </div>
  );
}
