'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import {
  scheduledPosts as initialScheduledPosts,
  ScheduledPost,
} from '@/lib/scheduled-posts';

type ScheduledPostsContextType = {
  scheduledPosts: ScheduledPost[];
  handleSchedulePost: (
    post: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>
  ) => void;
};

const ScheduledPostsContext = createContext<ScheduledPostsContextType | undefined>(
  undefined
);

export function ScheduledPostsProvider({ children }: { children: ReactNode }) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Hydrate initial state on client
  useEffect(() => {
    const sortedPosts = [...initialScheduledPosts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setScheduledPosts(sortedPosts);
  }, []);

  const handleSchedulePost = (
    newPostData: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>
  ) => {
    setScheduledPosts((prevPosts) => {
      const postToAdd: ScheduledPost = {
        ...newPostData,
        id: (prevPosts[prevPosts.length - 1]?.id ?? 0) + 1,
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
      };
      return [...prevPosts, postToAdd].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  return (
    <ScheduledPostsContext.Provider
      value={{ scheduledPosts, handleSchedulePost }}
    >
      {children}
    </ScheduledPostsContext.Provider>
  );
}

export function useScheduledPosts() {
  const context = useContext(ScheduledPostsContext);
  if (context === undefined) {
    throw new Error(
      'useScheduledPosts must be used within a ScheduledPostsProvider'
    );
  }
  return context;
}
