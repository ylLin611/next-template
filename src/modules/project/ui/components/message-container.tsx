import { ScrollArea } from '@/components/ui/scroll-area';
import { Fragment } from '@/generated/prisma/client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useStickToBottom } from 'use-stick-to-bottom';
import { MessageCard } from './message-card';
import { MessageForm } from './message-form';

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
  // fetch messages
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.list.queryOptions({
      projectId,
    }),
  );
  // auto scroll to bottom
  const { scrollRef, scrollToBottom, contentRef } = useStickToBottom();
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, contentRef, scrollRef, scrollToBottom]);
  // active fragment
  useEffect(() => {
    const lastMessageWithFragment = messages.findLast((message) => message.fragment !== null);
    if (lastMessageWithFragment) {
      setActiveFragment(lastMessageWithFragment.fragment);
    }
  }, [messages, setActiveFragment]);
  return (
    <div className="flex min-h-1 flex-1 flex-col">
      <ScrollArea className="min-h-1 flex-1 px-4 pt-2" ref={scrollRef}>
        <div ref={contentRef}>
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              createdAt={message.createdAt}
              role={message.role}
              fragment={message.fragment}
              isActiveFragment={message.fragment?.id === activeFragment?.id}
              type={message.type}
              onFragmentClick={() => {
                setActiveFragment(message.fragment);
              }}
            ></MessageCard>
          ))}
        </div>
      </ScrollArea>
      <div className="relative px-4 py-3">
        <div className="absolute -top-6 right-0 left-0 h-6 bg-linear-to-b from-transparent to-white"></div>
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
