'use client';

import React, { useState } from 'react';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import {
  scheduledPosts as initialScheduledPosts,
  ScheduledPost,
} from '@/lib/scheduled-posts';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(
    initialScheduledPosts.sort((a, b) => a.date.getTime() - b.date.getTime())
  );

  const handleSchedulePost = (newPostData: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>) => {
    const postToAdd: ScheduledPost = {
      ...newPostData,
      id: scheduledPosts.length + 1,
      likes: 0,
      comments: 0,
      shares: 0,
    };
    setScheduledPosts((prevPosts) =>
      [...prevPosts, postToAdd].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      )
    );
  };
  
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        scheduledPosts,
        handleSchedulePost,
        // @ts-ignore
      } as { scheduledPosts: ScheduledPost[], handleSchedulePost: (post: any) => void });
    }
    return child;
  });

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6 animate-in fade-in duration-500">
          {childrenWithProps}
        </main>
      </SidebarInset>
    </>
  );
}
