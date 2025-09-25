import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import { Connection, IConnection } from "../../components/Connection/Connection";
import { Title } from "../../components/Title/Title";
import classes from "./Invitations.module.scss";

export function Invitations() {
  const [connexions, setConnections] = useState<IConnection[]>([]);
  const [sent, setSent] = useState(false);
  const { user } = useAuthentication();
  const filtredConnections = sent
    ? connexions.filter((c) => c.author.id === user?.id)
    : connexions.filter((c) => c.recipient.id === user?.id);
  const ws = useWebSocket();

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe("/topic/users/" + user?.id + "/connections/new", (data) => {
      const connection = JSON.parse(data.body);
      setConnections((connections) => [connection, ...connections]);
    });

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) => connections.filter((c) => c.id !== connection.id));
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
    <div className={classes.invitationsContainer}>
      <div className={classes.headerSection}>
        <div className={classes.titleWrapper}>
          <div className={classes.iconBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 2H8C6.9 2 6 2.9 6 4v16l6-3 6 3V4C18 2.9 17.1 2 16 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <Title>Invitations ({connexions.length})</Title>
        </div>
        
        <div className={classes.tabsContainer}>
          <div className={classes.tabsWrapper}>
            <button 
              className={`${classes.tab} ${!sent ? classes.active : ''}`} 
              onClick={() => setSent(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Received</span>
              <div className={classes.tabBadge}>
                {connexions.filter((c) => c.recipient.id === user?.id).length}
              </div>
            </button>
            
            <button 
              className={`${classes.tab} ${sent ? classes.active : ''}`} 
              onClick={() => setSent(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sent</span>
              <div className={classes.tabBadge}>
                {connexions.filter((c) => c.author.id === user?.id).length}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className={classes.mainContent}>
        {filtredConnections.length === 0 ? (
          <div className={classes.emptyState}>
            <div className={classes.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                {sent ? (
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </div>
            <h3 className={classes.emptyTitle}>
              {sent ? 'No invitations sent' : 'No invitations received'}
            </h3>
            <p className={classes.emptyDescription}>
              {sent 
                ? 'You haven\'t sent any connection requests yet. Start building your network by connecting with professionals.'
                : 'No one has sent you connection requests yet. Your profile might appear in their suggestions soon.'
              }
            </p>
            {sent && (
              <button className={classes.exploreButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Find People to Connect
              </button>
            )}
          </div>
        ) : (
          <div className={classes.invitationsList}>
            <div className={classes.listHeader}>
              <span className={classes.listTitle}>
                {sent ? 'Invitations you sent' : 'Invitations received'}
              </span>
              <span className={classes.listCount}>
                {filtredConnections.length} {filtredConnections.length === 1 ? 'invitation' : 'invitations'}
              </span>
            </div>
            
            <div className={classes.connectionsGrid}>
              {filtredConnections.map((connection, index) => (
                <div key={connection.id} className={classes.connectionWrapper} style={{'--index': index} as React.CSSProperties}>
                  <Connection
                    connection={connection}
                    user={user}
                    setConnections={setConnections}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
