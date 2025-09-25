import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import classes from "./LeftSidebar.module.scss";

interface ILeftSidebarProps {
  user: IUser | null;
}

export function LeftSidebar({ user }: ILeftSidebarProps) {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const ws = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?userId=" + user?.id,
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) => [...connections, connection]);
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/remove",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) => connections.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  return (
    <div className={classes.root}>
      {/* Animated background gradient */}
      <div className={classes.backgroundGradient}></div>
      
      {/* Cover section */}
      <div className={classes.cover}>
        <img
          src={
            user?.coverPicture
              ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.coverPicture}`
              : "/cover.jpeg"
          }
          alt="Cover"
        />
        <div className={classes.coverOverlay}>
          <div className={classes.glassEffect}></div>
          <div className={classes.floatingParticles}>
            <div className={classes.particle}></div>
            <div className={classes.particle}></div>
            <div className={classes.particle}></div>
            <div className={classes.particle}></div>
          </div>
        </div>
      </div>

      {/* Avatar section */}
      <div className={classes.avatarSection}>
        <button 
          className={classes.avatar} 
          onClick={() => navigate("/profile/" + user?.id)}
        >
          <div className={classes.avatarRing}>
            <div className={classes.avatarInner}>
              <img
                src={
                  user?.profilePicture
                    ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
                    : "/avatar.svg"
                }
                alt="Profile"
              />
              <div className={classes.avatarOverlay}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
          <div className={classes.onlineStatus}></div>
        </button>
      </div>

      {/* User info */}
      <div className={classes.userInfo}>
        <div className={classes.nameSection}>
          <h2 className={classes.name}>
            {user?.firstName + " " + user?.lastName}
            <div className={classes.nameUnderline}></div>
          </h2>
          <div className={classes.verifiedBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className={classes.title}>
          <span className={classes.position}>{user?.position}</span>
          <span className={classes.separator}>at</span>
          <span className={classes.company}>{user?.company}</span>
        </div>
      </div>

      {/* Stats section - SIMPLIFIED VERSION */}
      <div className={classes.statsSection}>
        <div className={classes.statsHeader}>
          <h3>Network Overview</h3>
          <div className={classes.statsIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className={classes.info}>
          <button 
            className={classes.item} 
            onClick={() => navigate("/network/connections")}
          >
            <div className={classes.itemContent}>
              <div className={classes.itemHeader}>
                <span className={classes.label}>Connections</span>
                <div className={classes.itemIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className={classes.valueSection}>
                <span className={classes.value}>
                  {connections.filter((connection) => connection.status === "ACCEPTED").length}
                </span>
                <div className={classes.progressBar}>
                  <div 
                    className={classes.progressFill}
                    style={{
                      width: `${Math.min((connections.filter((connection) => connection.status === "ACCEPTED").length / 50) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* REMOVED THE PROBLEMATIC MINI AVATARS FOR NOW */}
              {connections.filter((connection) => connection.status === "ACCEPTED").length > 0 && (
                <div className={classes.connectionPreview}>
                  <div className={classes.connectionText}>
                    <span>✨ {connections.filter((connection) => connection.status === "ACCEPTED").length} active connections</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={classes.itemRipple}></div>
          </button>
        </div>

        {/* Quick actions */}
        <div className={classes.quickActions}>
          <button 
            className={classes.actionButton}
            onClick={() => navigate("/network/discover")}
          >
            <div className={classes.actionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span>Discover People</span>
            <div className={classes.actionArrow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </button>

          <button 
            className={classes.actionButton}
            onClick={() => navigate("/network/invitations")}
          >
            <div className={classes.actionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span>Invitations</span>
            <div className={classes.actionArrow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Floating action button */}
      <div className={classes.floatingAction}>
        <button 
          className={classes.fabButton}
          onClick={() => navigate("/network/discover")}
          title="Find new connections"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className={classes.fabRipple}></div>
        </button>
      </div>
    </div>
  );
}
