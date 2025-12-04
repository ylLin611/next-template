import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageCard } from './message-card';

interface Props {
  projectId: string;
}

export const MessageContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.list.queryOptions({
      projectId,
    }),
  );
  return (
    <div className="flex min-h-1 flex-1 flex-col">
      <div className="px-4 pt-2">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            createdAt={message.createdAt}
            role={message.role}
            fragment={message.fragment}
            isActiveFragment={false}
            type={message.type}
            onFragmentClick={() => {}}
          ></MessageCard>
        ))}
      </div>
    </div>
  );
};
