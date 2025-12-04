import { Card } from '@/components/ui/card';
import { Fragment } from '@/generated/prisma/client';
import { MessageRole, MessageType } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import Image from 'next/image';

interface UserMessageProps {
  content: string;
}
const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4">
      <Card className="bg-muted max-w-[80%] border-none p-3 wrap-break-word shadow-none">{content}</Card>
    </div>
  );
};

interface AssistantMessageProps {
  content: string;
  createdAt: Date;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
}
const AssistantMessage = ({
  content,
  createdAt,
  fragment,
  isActiveFragment,
  type,
  onFragmentClick,
}: AssistantMessageProps) => {
  return (
    <div className={cn('group flex flex-col pb-4', type === 'ERROR' && 'text-red-700 dark:text-red-500')}>
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image src="/logo.svg" alt="Vue0" width={18} height={18}></Image>
        <span className="text-sm font-medium">Vue0</span>
        <span className="text-muted-foreground text-xs font-medium opacity-0 group-hover:opacity-100">
          {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <div className="flex flex-col gap-y-4 pl-8">
        <span>{content}</span>
        {fragment && type === 'RESULT' && (
          <FragmentCard fragment={fragment} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} />
        )}
      </div>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}
const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
  return <button className={cn('flex items-start text-start')}></button>;
};

interface Props {
  content: string;
  createdAt: Date;
  role: MessageRole;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
}
export const MessageCard = ({ content, createdAt, role, fragment, isActiveFragment, type, onFragmentClick }: Props) => {
  if (role === 'ASSISTANT') {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        type={type}
        onFragmentClick={onFragmentClick}
      />
    );
  }
  return <UserMessage content={content} />;
};
