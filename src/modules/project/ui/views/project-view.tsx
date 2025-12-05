'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Fragment } from '@/generated/prisma/client';
import { Suspense, useState } from 'react';
import { MessageContainer } from '../components/message-container';

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col">
          <Suspense fallback={<div>Loading message...</div>}>
            <MessageContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          {activeFragment?.sandboxUrl && <iframe src={activeFragment.sandboxUrl} width="100%" height="100%"></iframe>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
