import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import { IConnection } from "../../components/Connection/Connection";
import { Title } from "../../components/Title/Title";
import classes from "./Network.module.scss";

export function Network() {
  usePageTitle("Network");
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [invitations, setInvitations] = useState<IConnection[]>([]);
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const navigate = useNavigate();
  const ws = useWebSocket();
  const { user } = useAuthentication();

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections",
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) => setInvitations(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    request<IUser[]>({
      endpoint: "/api/v1/networking/suggestions",
      onSuccess: (data) => setSuggestions(data),
      onFailure: (error) => console.log(error),
    }).then(() => setSuggestionsLoading(false));
  }, []);

  useEffect(() => {
    const subscription = ws?.subscribe("/topic/users/" + user?.id + "/connections/new", (data) => {
      const connection = JSON.parse(data.body);
      setInvitations((connections) => [connection, ...connections]);
      setSuggestions((suggestions) =>
        suggestions.filter((s) => s.id !== connection.author.id && s.id !== connection.recipient.id)
      );
    });

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) => [connection, ...connections]);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
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
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  return (
    <div className={classes.networkContainer}>
      <div className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <div className={classes.headerIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Title>My Network</Title>
        </div>

        <div className={classes.navigationMenu}>
          <NavLink 
            to="invitations" 
            className={({ isActive }) => `${classes.navItem} ${isActive ? classes.active : ''}`}
          >
            <div className={classes.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 2H8C6.9 2 6 2.9 6 4v16l6-3 6 3V4C18 2.9 17.1 2 16 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={classes.navLabel}>Invitations</span>
            <div className={classes.navBadge}>
              {invitations.length}
            </div>
          </NavLink>

          <NavLink 
            to="connections" 
            className={({ isActive }) => `${classes.navItem} ${isActive ? classes.active : ''}`}
          >
            <div className={classes.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={classes.navLabel}>Connections</span>
            <div className={classes.navBadge}>
              {connections.length}
            </div>
          </NavLink>
        </div>
      </div>

      <div className={classes.mainContent}>
        <div className={classes.contentArea}>
          <Outlet />
        </div>

        <div className={classes.suggestionsPanel}>
          <div className={classes.suggestionsHeader}>
            <div className={classes.suggestionsTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3>People you may know</h3>
            </div>
            <span className={classes.suggestionsCount}>
              {suggestions.length} suggestions
            </span>
          </div>

          <div className={classes.suggestionsContent}>
            {suggestionsLoading ? (
              <div className={classes.loadingState}>
                <Loader isInline />
                <span>Finding people you might know...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className={classes.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={suggestion.id} 
                    className={classes.suggestionCard}
                    style={{'--index': index} as React.CSSProperties}
                  >
                    <div className={classes.cardHeader}>
                      <img
                        src={suggestion.coverPicture || "/cover.jpeg"}
                        alt=""
                        className={classes.coverImage}
                      />
                      <button 
                        className={classes.profileButton}
                        onClick={() => navigate("/profile/" + suggestion.id)}
                      >
                        <img
                          className={classes.profileImage}
                          src={suggestion.profilePicture || "/avatar.svg"}
                          alt={`${suggestion.firstName} ${suggestion.lastName}`}
                        />
                      </button>
                    </div>
                    
                    <div className={classes.cardContent}>
                      <button 
                        className={classes.nameButton}
                        onClick={() => navigate("/profile/" + suggestion.id)}
                      >
                        <h4 className={classes.suggestionName}>
                          {suggestion.firstName} {suggestion.lastName}
                        </h4>
                      </button>
                      <p className={classes.suggestionPosition}>
                        {suggestion.position} at {suggestion.company}
                      </p>
                    </div>

                    <div className={classes.cardActions}>
                      <Button
                        outline
                        size="small"
                        className={classes.connectButton}
                        onClick={() => {
                          request<IConnection>({
                            endpoint: "/api/v1/networking/connections?recipientId=" + suggestion.id,
                            method: "POST",
                            onSuccess: () => {
                              setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
                            },
                            onFailure: (error) => console.log(error),
                          });
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Connect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={classes.emptyState}>
                <div className={classes.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className={classes.emptyText}>
                  No suggestions available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
