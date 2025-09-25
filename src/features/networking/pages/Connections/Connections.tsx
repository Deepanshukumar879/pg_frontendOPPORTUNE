import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import { Connection, IConnection } from "../../components/Connection/Connection";
import { Title } from "../../components/Title/Title";
import classes from "./Connections.module.scss";

export function Connections() {
  const [connexions, setConnections] = useState<IConnection[]>([]);
  const { user } = useAuthentication();
  const ws = useWebSocket();

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections",
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

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
    <div className={classes.connectionsContainer}>
      <div className={classes.headerSection}>
        <div className={classes.titleWrapper}>
          <Title>Connections ({connexions.length})</Title>
        </div>
      </div>

      <div className={classes.mainContent}>
        {connexions.length === 0 ? (
          <div className={classes.emptyState}>
            <div className={classes.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={classes.emptyTitle}>No connections yet</h2>
            <p className={classes.emptyDescription}>
              Start building your professional network. Connect with colleagues and industry professionals.
            </p>
          </div>
        ) : (
          <div className={classes.connectionsList}>
            {connexions.map((connection) => (
              <Connection
                key={connection.id}
                connection={connection}
                user={user}
                setConnections={setConnections}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
