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
    setScheduledPosts((prevPosts) => {
        const postToAdd: ScheduledPost = {
            ...newPostData,
            id: (prevPosts[prevPosts.length - 1]?.id ?? 0) + 1,
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
        };
        return [...prevPosts, postToAdd].sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
    });
  };
  
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { scheduledPosts, handleSchedulePost });
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
