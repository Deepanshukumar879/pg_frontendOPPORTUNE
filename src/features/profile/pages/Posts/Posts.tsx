import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { LeftSidebar } from "../../../feed/components/LeftSidebar/LeftSidebar";
import { IPost, Post } from "../../../feed/components/Post/Post";
import { RightSidebar } from "../../../feed/components/RightSidebar/RightSidebar";
import classes from "./Posts.module.scss";

export function Posts() {
  const { id } = useParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const { user: authUser } = useAuthentication();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  usePageTitle("Posts | " + user?.firstName + " " + user?.lastName);

  useEffect(() => {
    if (id == authUser?.id) {
      setUser(authUser);
      setLoading(false);
    } else {
      request<IUser>({
        endpoint: `/api/v1/authentication/users/${id}`,
        onSuccess: (data) => {
          setUser(data);
          setLoading(false);
        },
        onFailure: (error) => console.log(error),
      });
    }
  }, [authUser, id]);

  useEffect(() => {
    request<IPost[]>({
      endpoint: `/api/v1/feed/posts/user/${id}`,
      onSuccess: (data) => setPosts(data),
      onFailure: (error) => console.log(error),
    });
  }, [id]);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={classes.postsContainer}>
      <div className={classes.sidebarLeft}>
        <LeftSidebar user={user} />
      </div>
      
      <div className={classes.mainContent}>
        <div className={classes.pageHeader}>
          <div className={classes.headerContent}>
            <div className={classes.profileSection}>
              <img
                className={classes.profileImage}
                src={
                  user?.profilePicture
                    ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
                    : "/avatar.svg"
                }
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <div className={classes.profileInfo}>
                <h1 className={classes.pageTitle}>
                  {user?.firstName} {user?.lastName}'s posts
                </h1>
                <div className={classes.profileMeta}>
                  <span className={classes.postCount}>
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                  <div className={classes.separator}>•</div>
                  <span className={classes.profileRole}>
                    {user?.position} at {user?.company}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={classes.headerActions}>
              <div className={classes.sortButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Most recent</span>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.postsSection}>
          {posts.length > 0 ? (
            <div className={classes.postsList}>
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className={classes.postWrapper}
                  style={{'--index': index} as React.CSSProperties}
                >
                  <Post post={post} setPosts={setPosts} />
                </div>
              ))}
            </div>
          ) : (
            <div className={classes.emptyState}>
              <div className={classes.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={classes.emptyContent}>
                <h3 className={classes.emptyTitle}>
                  {authUser?.id === user?.id ? 'No posts yet' : 'No posts to display'}
                </h3>
                <p className={classes.emptyDescription}>
                  {authUser?.id === user?.id 
                    ? 'Start sharing your thoughts and insights with your network.'
                    : `${user?.firstName || 'This user'} hasn't shared any posts yet.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={classes.sidebarRight}>
        <RightSidebar />
      </div>
    </div>
  );
}
