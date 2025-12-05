import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'sonner';
import z from 'zod';

interface MessageFormProps {
  projectId: string;
}

const formSchema = z.object({
  content: z.string().min(1, '请输入').max(10000, '不能超过10000个字符'),
});

export const MessageForm = ({ projectId }: MessageFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.list.queryOptions({
            projectId,
          }),
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const [isFocused, setIsFocused] = useState(false);
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.content,
      projectId,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'bg-sidebar relative rounded-xl border p-4 pt-1 transition-all duration-300',
          isFocused ? 'border-primary' : 'border-transparent',
        )}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <TextareaAutoSize
              disabled={isPending}
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
              minRows={2}
              maxRows={8}
              className="w-full resize-none border-none bg-transparent pt-4 outline-none"
            />
          )}
        ></FormField>
        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="text-muted-foreground text-[10px]">
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1 font-medium select-none">
              <span>&#8984;</span>Enter
            </kbd>
            <span className="ml-1">to submit</span>
          </div>
          <Button
            disabled={isButtonDisabled}
            className={cn('size-8 rounded-full', isButtonDisabled && 'bg-muted-foreground border')}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : <ArrowUpIcon></ArrowUpIcon>}
          </Button>
        </div>
      </form>
    </Form>
  );
};
