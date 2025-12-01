'use client';

import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [text, setText] = useState('');

  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success('Success');
      },
    }),
  );
  const handleInvoke = () => {
    invoke.mutate({ text });
  };

  return (
    <div className="">
      <ThemeToggler></ThemeToggler>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      <Button disabled={invoke.isPending} onClick={handleInvoke}>
        Click me
      </Button>
    </div>
  );
}
