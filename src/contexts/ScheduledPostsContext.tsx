'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import {
  initialScheduledPosts,
  ScheduledPost,
} from '@/lib/scheduled-posts';

type ScheduledPostsContextType = {
  scheduledPosts: ScheduledPost[];
  loading: boolean;
  handleSchedulePost: (
    post: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>
  ) => Promise<void>;
};

const ScheduledPostsContext = createContext<
  ScheduledPostsContextType | undefined
>(undefined);

export function ScheduledPostsProvider({ children }: { children: ReactNode }) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    if (!user) {
      setScheduledPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const postsCollectionRef = collection(db, 'users', user.uid, 'posts');
      const q = query(postsCollectionRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If the user has no posts, seed their account with initial data
        const seedingPromises = initialScheduledPosts.map((post) => {
          const postWithRandomStats = {
            ...post,
            date: Timestamp.fromDate(new Date(post.date)),
            likes: Math.floor(Math.random() * 250),
            comments: Math.floor(Math.random() * 60),
            shares: Math.floor(Math.random() * 30),
          }
          return addDoc(postsCollectionRef, postWithRandomStats);
        });
        await Promise.all(seedingPromises);
        
        // Re-fetch after seeding
        const seededSnapshot = await getDocs(q);
        const postsList = seededSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
          } as unknown as ScheduledPost;
        });
        setScheduledPosts(postsList);
      } else {
        const postsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
          } as unknown as ScheduledPost;
        });
        setScheduledPosts(postsList);
      }
    } catch (error) {
      console.error('Error fetching posts: ', error);
      // Handle error appropriately, maybe set an error state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSchedulePost = async (
    newPostData: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>
  ) => {
    if (!user) {
      throw new Error('User must be logged in to schedule posts.');
    }

    const postToAdd = {
      ...newPostData,
      date: Timestamp.fromDate(new Date(newPostData.date)),
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
    };

    const postsCollectionRef = collection(db, 'users', user.uid, 'posts');
    await addDoc(postsCollectionRef, postToAdd);

    // Re-fetch posts to update the UI
    await fetchPosts();
  };

  return (
    <ScheduledPostsContext.Provider
      value={{ scheduledPosts, loading, handleSchedulePost }}
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
