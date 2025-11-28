'use client';

import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success('Success');
      },
    }),
  );
  const handleInvoke = () => {
    invoke.mutate({ text: 'lin' });
  };
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <ThemeToggler></ThemeToggler>
      <Button disabled={invoke.isPending} onClick={handleInvoke}>
        Click me
      </Button>
    </div>
  );
}
