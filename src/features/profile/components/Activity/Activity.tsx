import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IPost, Post } from "../../../feed/components/Post/Post";
import classes from "./Activity.module.scss";

interface IActivityProps {
  user: IUser | null;
  authUser: IUser | null;
  id: string | undefined;
}

export function Activity({ user, authUser, id }: IActivityProps) {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    request<IPost[]>({
      endpoint: `/api/v1/feed/posts/user/${id}`,
      onSuccess: (data) => setPosts(data),
      onFailure: (error) => console.log(error),
    });
  }, [id]);

  return (
    <div className={classes.activityContainer}>
      <div className={classes.activityCard}>
        <div className={classes.cardHeader}>
          <div className={classes.titleSection}>
            <div className={classes.titleIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 4.01c0 0-.43-.84-1.85-1.23l-4.86-.83A2 2 0 0 0 13.5 3l-4.48.48A2 2 0 0 0 7 4.48v12.69a1.5 1.5 0 0 0 1.5 1.5h2.78a2 2 0 0 0 1.95-1.54l1.02-5.78a2 2 0 0 1 1.95-1.64h5.3a2 2 0 0 1 1.5.68z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21v-3a2 2 0 0 0-2-2v-4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={classes.sectionTitle}>Recent Activity</h2>
          </div>

          {posts.length > 0 && (
            <div className={classes.headerActions}>
              <Link 
                to={`/profile/${user?.id}/posts`}
                className={classes.viewAllButton}
              >
                <span>View all posts</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </div>

        <div className={classes.cardContent}>
          {posts.length > 0 ? (
            <div className={classes.postsSection}>
              <div className={classes.featuredPost}>
                <Post
                  key={posts[posts.length - 1].id}
                  post={posts[posts.length - 1]}
                  setPosts={setPosts}
                />
              </div>

              {posts.length > 1 && (
                <div className={classes.morePostsIndicator}>
                  <div className={classes.postCount}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{posts.length - 1} more posts</span>
                  </div>
                  
                  <Link 
                    to={`/profile/${user?.id}/posts`}
                    className={classes.seeMoreLink}
                  >
                    <span>See all activity</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17l9.2-9.2M17 17V7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className={classes.emptyState}>
              <div className={classes.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={classes.emptyContent}>
                <h3 className={classes.emptyTitle}>
                  {authUser?.id === user?.id ? 'Share your first post' : 'No posts yet'}
                </h3>
                <p className={classes.emptyDescription}>
                  {authUser?.id === user?.id 
                    ? 'Start sharing your thoughts, insights, and updates with your network.'
                    : `${user?.firstName || 'This user'} hasn't shared any posts yet.`
                  }
                </p>
                {authUser?.id === user?.id && (
                  <Link 
                    to="/feed"
                    className={classes.createPostButton}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Create your first post
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
