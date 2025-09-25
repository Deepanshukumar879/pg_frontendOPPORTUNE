import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthentication } from "../../features/authentication/contexts/AuthenticationContextProvider";
import { INotification } from "../../features/feed/pages/Notifications/Notifications";
import { IConversation } from "../../features/messaging/components/Conversations/Conversations";
import { IConnection } from "../../features/networking/components/Connection/Connection";
import { useWebSocket } from "../../features/ws/WebSocketContextProvider";
import { request } from "../../utils/api";
import classes from "./Header.module.scss";
import { Profile } from "./components/Profile/Profile";
import { Search } from "./components/Search/Search";

export function Header() {
  const { user } = useAuthentication();
  const webSocketClient = useWebSocket();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(
    window.innerWidth > 1080 ? true : false
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const nonReadNotificationCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const location = useLocation();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const nonReadMessagesCount = conversations.reduce(
    (acc, conversation) =>
      acc +
      conversation.messages.filter((message) => message.sender.id !== user?.id && !message.isRead)
        .length,
    0
  );
  const [invitations, setInvitations] = useState<IConnection[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setShowNavigationMenu(window.innerWidth > 1080);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    request<IConversation[]>({
      endpoint: "/api/v1/messaging/conversations",
      onSuccess: (data) => setConversations(data),
      onFailure: (error) => console.log(error),
    });
  }, [location.pathname]);

  useEffect(() => {
    request<INotification[]>({
      endpoint: "/api/v1/notifications",
      onSuccess: setNotifications,
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/conversations`,
      (message) => {
        const conversation = JSON.parse(message.body);
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex((c) => c.id === conversation.id);
          if (index === -1) {
            if (conversation.author.id === user?.id) return prevConversations;
            return [conversation, ...prevConversations];
          }
          return prevConversations.map((c) => (c.id === conversation.id ? conversation : c));
        });
      }
    );
    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscribtion = webSocketClient?.subscribe(
      `/topic/users/${user?.id}/notifications`,
      (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => {
          const index = prev.findIndex((n) => n.id === notification.id);
          if (index === -1) {
            return [notification, ...prev];
          }
          return prev.map((n) => (n.id === notification.id ? notification : n));
        });
      }
    );
    return () => subscribtion?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) =>
        setInvitations(data.filter((c) => !c.seen && c.recipient.id === user?.id)),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/new",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((connections) =>
          connection.recipient.id === user?.id ? [connection, ...connections] : connections
        );
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/remove",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  useEffect(() => {
    const subscription = webSocketClient?.subscribe(
      "/topic/users/" + user?.id + "/connections/seen",
      (data) => {
        const connection = JSON.parse(data.body);
        setInvitations((invitations) => invitations.filter((c) => c.id !== connection.id));
      }
    );

    return () => subscription?.unsubscribe();
  }, [user?.id, webSocketClient]);

  return (
    <header className={classes.root}>
      <div className={classes.container}>
        <div className={classes.left}>
          <NavLink to="/" className={classes.logoLink}>
            <div className={classes.logoContainer}>
              {/* Custom Opportune Logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="none"
                className={classes.logo}
              >
                <defs>
                  <linearGradient id="opportuneLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#opportuneLogo)" />
                <path
                  d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                  fill="white"
                />
                <circle cx="16" cy="16" r="3" fill="white" />
              </svg>
              <span className={classes.logoText}>Opportune</span>
            </div>
          </NavLink>
          <div className={classes.searchWrapper}>
            <Search />
          </div>
        </div>

        <div className={classes.right}>
          {showNavigationMenu ? (
            <nav className={classes.navigation} role="navigation" aria-label="Main navigation">
              <ul className={classes.navList}>
                <li className={classes.navItem}>
                  <NavLink
                    to="/"
                    className={({ isActive }) => `${classes.navLink} ${isActive ? classes.active : ""}`}
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (window.innerWidth <= 1080) {
                        setShowNavigationMenu(false);
                      }
                    }}
                    aria-label="Home"
                  >
                    <div className={classes.iconWrapper}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={classes.navIcon}
                        aria-hidden="true"
                      >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <span className={classes.navLabel}>Home</span>
                  </NavLink>
                </li>

                <li className={classes.navItem}>
                  <NavLink
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (window.innerWidth <= 1080) {
                        setShowNavigationMenu(false);
                      }
                    }}
                    to="/network"
                    className={({ isActive }) => `${classes.navLink} ${isActive ? classes.active : ""}`}
                    aria-label={`Network${invitations.length > 0 ? ` (${invitations.length} invitations)` : ""}`}
                  >
                    <div className={classes.iconWrapper}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={classes.navIcon}
                        aria-hidden="true"
                      >
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-4h2l-3-4-3 4h2zm6-7.5C10 8.57 8.43 7 6.5 7S3 8.57 3 10.5 4.57 14 6.5 14s3.5-1.57 3.5-3.5zM17.5 17c1.38 0 2.5-1.12 2.5-2.5S18.88 12 17.5 12 15 13.12 15 14.5s1.12 2.5 2.5 2.5z" />
                      </svg>
                      {invitations.length > 0 && !location.pathname.includes("network") && (
                        <span className={classes.badge}>{invitations.length}</span>
                      )}
                    </div>
                    <span className={classes.navLabel}>Network</span>
                  </NavLink>
                </li>

                <li className={classes.navItem}>
                  <NavLink
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (window.innerWidth <= 1080) {
                        setShowNavigationMenu(false);
                      }
                    }}
                    to="/messaging"
                    className={({ isActive }) => `${classes.navLink} ${isActive ? classes.active : ""}`}
                    aria-label={`Messaging${nonReadMessagesCount > 0 ? ` (${nonReadMessagesCount} unread)` : ""}`}
                  >
                    <div className={classes.iconWrapper}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={classes.navIcon}
                        aria-hidden="true"
                      >
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L15.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                      {nonReadMessagesCount > 0 && !location.pathname.includes("messaging") && (
                        <span className={classes.badge}>{nonReadMessagesCount}</span>
                      )}
                    </div>
                    <span className={classes.navLabel}>Messaging</span>
                  </NavLink>
                </li>

                <li className={classes.navItem}>
                  <NavLink
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (window.innerWidth <= 1080) {
                        setShowNavigationMenu(false);
                      }
                    }}
                    to="/notifications"
                    className={({ isActive }) => `${classes.navLink} ${isActive ? classes.active : ""}`}
                    aria-label={`Notifications${nonReadNotificationCount > 0 ? ` (${nonReadNotificationCount} unread)` : ""}`}
                  >
                    <div className={classes.iconWrapper}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={classes.navIcon}
                        aria-hidden="true"
                      >
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                      {nonReadNotificationCount > 0 && (
                        <span className={classes.badge}>{nonReadNotificationCount}</span>
                      )}
                    </div>
                    <span className={classes.navLabel}>Notifications</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          ) : null}

          <button
            className={classes.mobileMenuToggle}
            onClick={() => {
              setShowNavigationMenu((prev) => !prev);
              setShowProfileMenu(false);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={showNavigationMenu}
          >
            <div className={`${classes.hamburger} ${showNavigationMenu ? classes.open : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={classes.toggleLabel}>Menu</span>
          </button>

          {user ? (
            <Profile
              setShowNavigationMenu={setShowNavigationMenu}
              showProfileMenu={showProfileMenu}
              setShowProfileMenu={setShowProfileMenu}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
